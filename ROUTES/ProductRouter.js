import expres from "express";
import {
  AllProducts,
  FindByCategory,
  FindProductById,
} from "../CONTROLLS/ProductController.js";

const ProductRouter = expres.Router();
//Checking products
ProductRouter.get("/products", AllProducts);
//check product id based
ProductRouter.get("/products/:id", FindProductById);
//check product category based
ProductRouter.get("/products/category/:categoryname", FindByCategory);

export default ProductRouter;
