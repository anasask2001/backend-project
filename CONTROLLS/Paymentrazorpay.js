import Razorpay from "razorpay";
import User from "../MODELS/UserModel.js";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import OrderDetiles from "../MODELS/Orders.js";
import Product from "../MODELS/ProductModel.js";

dotenv.config();

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

    var Razorpayinstance = new Razorpay({
      key_id: process.env.ID_KEY,
      key_secret: process.env.KEY_SECRET,
    });

    try {
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
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userid,
    } = req.body;

    const key_secret = process.env.KEY_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (razorpay_signature !== expectedSignature) {
      return res
        .status(404)
        .json({ status: "failure..", message: "INVALID SIGNATURE.." });
    } else {
      const user = await User.findById(userid).populate({
        path: "Cart",
        populate: { path: "ProductId" },
      });
      if (!user) {
        return res.status(404).json({ message: "USER NOT FOUND" });
      }
      const Order = new OrderDetiles({
        UserId: user._id,

        Product: user.Cart.map((item) => ({
          ProductId: item.Product._id,
          Quantity: item.Quantity,
        })),

        PaymentId: razorpay_payment_id,
        OrderId: razorpay_order_id,
      });

      await Order.save();
      //clear user cart
      user.Cart = [];

      await user.save();

      return res.status(200).json({ message: "Sucess ordered", Order });
    }
  } catch (error) {
    next(error);
  }
};
