import express from "express"
import { AddToCart } from "../CONTROLLS/CartproductController.js"


const ProductCartRouter = express.Router()
ProductCartRouter.post('/:userid/cart/:productid',AddToCart)






export default ProductCartRouter