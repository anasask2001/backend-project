import express from "express"
import { AddtoWishlist, DeleteWishlist, ViewWishlist } from "../CONTROLLS/WishlistController.js";





const WishlistRoute = express.Router()

//Adding wishlist
WishlistRoute.post("/:userid/wishlist/:productid",AddtoWishlist)
//viewing Wishlist
WishlistRoute.get("/:userid/wishlist",ViewWishlist)
//DeleteWishlist
WishlistRoute.delete("/:userid/wishlist/:productid/remove",DeleteWishlist)

export default WishlistRoute;