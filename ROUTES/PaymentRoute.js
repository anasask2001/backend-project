import express from 'express'
import Razorpay from "razorpay"
import { payment } from '../CONTROLLS/Paymentrazorpay.js'



const OrderPaymenyRouter = express.Router()

OrderPaymenyRouter.post("/:userid/payment",payment)
 

export default OrderPaymenyRouter