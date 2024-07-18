import mongoose from "mongoose";
//user Schemas
const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
  },

  Password: {
    type: String,
    required: true,
  },
  

  ProfileImg: {
    type: String,
    required: true,
  },
  AccountCreatedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  Cart: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
    },
  ],

  Wishlist:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Wishlist"
  }],

  IsDeleted: {
    type: Boolean,
    default: false,
  },
  Order:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"OrderDetiles"
  }]
});
const User = mongoose.model("User", UserSchema);
export default User;
