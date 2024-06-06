import mongoose from "mongoose";

//wishlist Schema

const Wishlists = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },

    ProductId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        
        required:true

    },
    Quantity:{
        type:Number,
        default:1
    }


})

const Wishlist = mongoose.model("Wishlist",Wishlists)
export default Wishlist