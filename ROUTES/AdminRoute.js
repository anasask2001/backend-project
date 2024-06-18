import express from "express";
import uploadImage from "../MIDDLEWARE/CovertCloudinry.js";
import { Addproduct, AdminLogin, SpecificUser, ViewAllUsers } from "../CONTROLLS/AdminProductcontroller.js";

const RouterAdmin = express.Router();
//Admin product Adding
RouterAdmin.post("/products", uploadImage, Addproduct);
RouterAdmin.post("/adminlogin", AdminLogin);
RouterAdmin.get("/viewallusers", ViewAllUsers);
RouterAdmin.get("/viewusers/:userid",SpecificUser);

export default RouterAdmin;
