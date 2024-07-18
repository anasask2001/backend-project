import express from "express";
import {
  AddtoWishlist,
  DeleteWishlist,
  ViewWishlist,
} from "../CONTROLLS/WishlistController.js";
import UserToken from "../MIDDLEWARE/UserJwtToken.js";



const WishlistRoute = express.Router();

//Adding wishlist
WishlistRoute.post("/:userid/wishlist/:productid", UserToken,AddtoWishlist);
//viewing Wishlist
WishlistRoute.get("/:userid/wishlist",UserToken,ViewWishlist);
//DeleteWishlist
WishlistRoute.delete("/:userid/wishlist/:productid/remove",UserToken,DeleteWishlist);

export default WishlistRoute;
