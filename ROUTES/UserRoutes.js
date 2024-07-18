import express from "express";
import { Login, SignUp, userorder } from "../CONTROLLS/UserController.js";
import uploadImage from "../MIDDLEWARE/CovertCloudinry.js"


const Routeruser = express.Router();
//Authentication Routes

//user register
Routeruser.post("/register",uploadImage, SignUp);
//user login
Routeruser.post("/login", Login);

Routeruser.get("/userorder/:userid",userorder)

export default Routeruser;
