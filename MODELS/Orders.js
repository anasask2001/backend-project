import mongoose from "mongoose";

//Order detiles Schema
const OrderSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    PurchaseDate:{
        type: Date,
        required:true,
        default:Date.now
    },
    OrderTime:{
        type:String,
        required:true,
        default:new Date().toTimeString()
    },
    OrderId:{
        type:String,
        required:true
    },

    TotalPrice:{
        type:Number,
        required:true
    },
    TotalItem:{
        type:Number,
        required:true
    },
    PaymentId:{
        type:String,
        required:true
    }


})
const OrderDetiles = mongoose.model("OrderDetiles", OrderSchema);
export default OrderDetiles;
