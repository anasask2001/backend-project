import express from "express";
import uploadImage from "../MIDDLEWARE/CovertCloudinry.js";
import {
  Addproduct,
  AdminLogin,
  DeleteProduct,
  ShowAllOrder,
  ShowCategory,
  ShowProducts,
  SpecificUser,
  Specificproduct,
  UpdateProduct,
  ViewAllUsers,
  status,
} from "../CONTROLLS/AdminProductcontroller.js";
import admintoken from "../MIDDLEWARE/AdminToken.js";




const RouterAdmin = express.Router();



//admin login
RouterAdmin.post("/adminlogin", AdminLogin);
//Admin product Adding
RouterAdmin.post("/products",uploadImage,admintoken,Addproduct);
//admin view all users
RouterAdmin.get("/viewallusers",admintoken ,ViewAllUsers);
//admin show specific user
RouterAdmin.get("/viewusers/:userid",admintoken ,SpecificUser);
//admin view all product
RouterAdmin.get("/showproducts",admintoken ,ShowProducts);
//admin show specific product
RouterAdmin.get("/showproducts/:productid",admintoken ,Specificproduct);
//show category base
RouterAdmin.get("/productscategory",admintoken ,ShowCategory);
//admin delete product
RouterAdmin.delete("/deleteproduct/:productid",admintoken ,DeleteProduct);
//admin update product
RouterAdmin.patch("/updateproduct/:productid",admintoken,UpdateProduct);
//admin view all orders
RouterAdmin.get("/showorders",admintoken ,ShowAllOrder);
//admin check orders status
RouterAdmin.get("/status",admintoken,status);

export default RouterAdmin;
