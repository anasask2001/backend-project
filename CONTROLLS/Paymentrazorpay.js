import Razorpay from "razorpay";
import User from "../MODELS/UserModel.js";
import dotenv from 'dotenv';

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
    
    if (!CartProduct || CartProduct.length === 0) {
      return res.status(404).json({ message: "Cart is empty", data: [] });
    }

    let totalamount = 0;
    let totalquantity = 0;

    CartProduct.forEach(item => {
      totalamount += item.ProductId.ProductPrice * item.Quantity;
      totalquantity += item.Quantity;
    });

    var Razorpayinstance = new Razorpay({
      key_id: process.env.ID_KEY,
      key_secret: process.env.KEY_SECRET
    });

    try {
      const payment = await Razorpayinstance.orders.create({
        amount: totalamount*100, //  (convert from INR)
        currency: "INR",
        receipt: `receipt_order_${userid}`,
        payment_capture: 1
      });

      return res.json({
        status: "success",
        message: "Payment initiated",
        data: payment
      });
    } catch (razorpayError) {
      console.error("Razorpay Error:", razorpayError);
      return res.status(500).json({ error: "Failed to create Razorpay order", details: razorpayError.message });
    }
  } catch (error) {
    console.error("Server Error:", error);
   next(error)
  }
};
