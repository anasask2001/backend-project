import Razorpay from "razorpay";
import User from "../MODELS/UserModel.js";
import dotenv from "dotenv";
import OrderDetails from "../MODELS/Orders.js";
import crypto, { Hmac } from "crypto"

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.ID_KEY,
  key_secret: process.env.KEY_SECRET,
});

// PAYMENT SECTION
export const payment = async (req, res, next) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid).populate({
      path: "Cart",
      populate: { path: "ProductId" },
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

   

    const options = {
      amount: totalamount * 100, // convert to paise (smallest currency unit in INR)
      currency: "INR",
      receipt: `receipt_order_${userid}`,
      notes: {
        userid: userid,
      },
      payment_capture: 1,
    };

    try {
      const payment = await razorpayInstance.orders.create(options);

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
    
    const key_secret = process.env.KEY_SECRET;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const expectedSignature = crypto.createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
       .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);




    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
    const Order = await razorpayInstance.orders.fetch(razorpay_order_id);
    
    const user = await User.findById(Order.notes.userid).populate({path:"Cart",populate:{path:"ProductId"}});

    const orderItems = user.Cart.map((item) => ({
      ProductId: item.ProductId._id,
      Quantity: item.Quantity,
      ProductPrice: item.ProductId.ProductPrice, // Include ProductPrice in the mapping
    }));
    
    const totalamount = orderItems.reduce((sum, item) => sum + (item.Quantity * item.ProductPrice), 0);
    
    // Validate totalamount before proceeding
    if (isNaN(totalamount)) {
      throw new Error('Total amount calculation resulted in NaN');
    }
    
    const order = new OrderDetails({
      UserId: user._id,
      Products: orderItems,
      PaymentId: razorpay_payment_id,
      OrderId: razorpay_order_id,
      TotalPrice: totalamount,
      TotalItem: orderItems.length,
    });
    
    await order.save().catch(err => {
      console.error('Error saving order details:', err);
    });
    
 
    user.Order.push(order)
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
