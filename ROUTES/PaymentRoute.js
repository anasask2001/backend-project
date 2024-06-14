import express from 'express'
import { VerifyPayment, payment } from '../CONTROLLS/Paymentrazorpay.js'



const   OrderPaymenyRouter = express.Router()

OrderPaymenyRouter.post("/:userid/payment",payment)
OrderPaymenyRouter.get("/:userid/orders",VerifyPayment);
 

export default OrderPaymenyRouter