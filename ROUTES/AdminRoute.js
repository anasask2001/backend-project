import express from "express";
import uploadImage from "../MIDDLEWARE/CovertCloudinry.js";
import { Addproduct } from "../CONTROLLS/AdminProductcontroller.js";

const RouterAdmin = express.Router();
//Admin product Adding
RouterAdmin.post("/products", uploadImage, Addproduct);

export default RouterAdmin;
