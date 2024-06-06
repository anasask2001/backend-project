import expres from "express";
import {
  AllProducts,
  FindByCategory,
  FindProductById,
} from "../CONTROLLS/ProductController.js";


const ProductRouter = expres.Router();
//Checking products
ProductRouter.get("/products", AllProducts);
ProductRouter.get("/products/:id", FindProductById);
ProductRouter.get("/products/category/:categoryname", FindByCategory);

export default ProductRouter;
