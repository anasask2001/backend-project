import express from "express";
import { VerifyPayment, payment } from "../CONTROLLS/Paymentrazorpay.js";
import UserToken from "../MIDDLEWARE/UserJwtToken.js";


const OrderPaymenyRouter = express.Router();
//payment setup route
OrderPaymenyRouter.post("/:userid/payment",UserToken,payment);
//paymentverify route
OrderPaymenyRouter.post("/verifypayment" ,VerifyPayment);

export default OrderPaymenyRouter;
