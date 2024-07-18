import express from "express"
import { AddToCart,  DecreamentcartItem,  DeleteCart, IncreamentcartItem, ViewCart,  } from "../CONTROLLS/CartproductController.js"
import UserToken from "../MIDDLEWARE/UserJwtToken.js"



const ProductCartRouter = express.Router()
//Adding product cart route
ProductCartRouter.post('/:userid/cart/:productid',UserToken,AddToCart)
//view user cart
ProductCartRouter.get('/:userid/cart',UserToken,ViewCart)
//ProductCartincreament
ProductCartRouter.patch('/:userid/cart/:productid/increament',UserToken,IncreamentcartItem)
//productcartde4creament
ProductCartRouter.patch('/:userid/cart/:productid/decreament',UserToken,DecreamentcartItem)
//delete product
ProductCartRouter.delete('/:userid/cart/remove/:productid',UserToken,DeleteCart)





export default ProductCartRouter