import mongoose from "mongoose";
//Cart Schema
const UserSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  Quantity: {
    type: Number,
    default: 1,
    required: true,
  },
});
const Cart = mongoose.model("Cart", UserSchema);
export default Cart;
