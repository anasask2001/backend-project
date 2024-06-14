import Razorpay from "razorpay";
import User from "../MODELS/UserModel.js";
import crypto from "crypto";
import dotenv from "dotenv";
import OrderDetiles from "../MODELS/Orders.js";


dotenv.config();

// PAYMENT SECTION
export const payment = async (req, res, next) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid).populate({
      path: "Cart",
      populate: { path: "ProductId" }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const CartProduct = user.Cart;

    if (CartProduct.length === 0) {
      return res.status(404).json({ message: "Cart is empty", data: [] });
    }

    let totalamount = 0;
    let totalquantity = 0;

    CartProduct.forEach((item) => {
      totalamount += item.ProductId.ProductPrice * item.Quantity;
      totalquantity += item.Quantity;
    });

    var Razorpayinstance = new Razorpay({
      key_id: process.env.ID_KEY,
      key_secret: process.env.KEY_SECRET,
    });

    
      const payment = await Razorpayinstance.orders.create({
        amount: totalamount * 100, //  (convert from INR)
        currency: "INR",
        receipt: `receipt_order_${userid}`,
        payment_capture: 1,
      });

      return res.json({
        status: "success",
        message: "Payment initiated",
        data: payment,
      });
    } catch (razorpayError) {
      console.error("Razorpay Error:", razorpayError);
      return res.status(500).json({
        error: "Failed to create Razorpay order",
        details: razorpayError.message,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    next(error);
  }
};


//payment order verification 
export const VerifyPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userid } = req.body;

    const key_secret = process.env.KEY_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ status: "failure", message: "Invalid signature" });
    }

    const user = await User.findById(userid).populate({
      path: "Cart",
      populate: { path: "ProductId" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderItems = user.Cart.map((item) => ({
      ProductId: item.ProductId._id,
      Quantity: item.Quantity,
    }));

    const totalamount = orderItems.reduce((sum, item) => sum + (item.Quantity * item.ProductId.ProductPrice), 0);

    const order = new OrderDetiles({
      UserId: user._id,
      Products: orderItems,
      PaymentId: razorpay_payment_id,
      OrderId: razorpay_order_id,
      TotalPrice: totalamount,
      TotalItem: orderItems.length,
    });

    await order.save();

    // Clear user's cart
    user.Cart = [];
    await user.save();

    return res.status(200).json({ status: "success", message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error in VerifyPayment:", error);
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};
