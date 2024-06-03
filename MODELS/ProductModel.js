import mongoose from "mongoose";
//ProductSchema
const ProductSchema = new mongoose.Schema({
  ProductTitle: {
    type: String,
    required: true,
  },
  ProductDescription: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  ProductImage: {
    type: String,
    required: true,
  },
  ProductCategory: {
    type: String,
    required: true,
  },
  Quantity: { type: Number, default: 1 },

  ProductIsdeleted: {
    type: Boolean,
    default: false,
  },
});
const Product = mongoose.model("Product", ProductSchema);
export default Product;
