import mongoose from "mongoose";
//Cart Schema
const UserSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required:true
  },

  Quantity: {
    type: Number,
    default: 1,
    required: true,
  },
});
const Cart = mongoose.model("Cart", UserSchema);
export default Cart;
