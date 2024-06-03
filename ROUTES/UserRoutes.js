import express from "express";
import { Login, SignUp } from "../CONTROLLS/UserController.js";
import uploadImage from "../MIDDLEWARE/CovertCloudinry.js";

const Routeruser = express.Router();
//Authentication Routes
Routeruser.post("/register", uploadImage, SignUp);
Routeruser.post("/login", Login);

export default Routeruser;
