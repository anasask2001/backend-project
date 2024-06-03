import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/DB.js";
import cookieParser from "cookie-parser";
import RouterUser from "./ROUTES/UserRoutes.js";
import RouterAdmin from "./ROUTES/AdminRoute.js";
import ProductRouter from "./ROUTES/ProductRouter.js";
import ProductCartRouter from "./ROUTES/ProductCartRoute.js";
import mongoose from "mongoose";

//dotenv confiuger
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
//Users
app.use("/api/users", RouterUser);
app.use("/api/users", ProductRouter);
app.use("/api/users", ProductCartRouter);
//Admins
app.use("/api/admin", RouterAdmin);
mongoose.connect(process.env.DB)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));
const PORT = process.env.PORT || 3004;
//localhost
app.listen(PORT, () => {
  console.log(`server running is port ${PORT}`);
});
