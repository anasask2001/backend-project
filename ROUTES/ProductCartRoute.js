import express from "express"
import { AddToCart, DecreamentcartItem, DeleteCart, IncreamentcartItem, ViewCart } from "../CONTROLLS/CartproductController.js"


const ProductCartRouter = express.Router()
//Adding product cart route
ProductCartRouter.post('/:userid/cart/:productid',AddToCart)
//view user cart
ProductCartRouter.get('/:userid/cart',ViewCart)
//ProductCartincreament
ProductCartRouter.patch('/:userid/cart/:productid/increament',IncreamentcartItem)
//productcartde4creament
ProductCartRouter.patch('/:userid/cart/:productid/decreament',DecreamentcartItem)
//delete product
ProductCartRouter.delete('/:userid/cart/remove/:productid',DeleteCart)





export default ProductCartRouter