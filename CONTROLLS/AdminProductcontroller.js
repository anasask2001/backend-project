import Productjoi from "../VALIDATION/ProductJoiValidation.js";
import Product from "../MODELS/ProductModel.js";
import dotenv from "dotenv"
import User from "../MODELS/UserModel.js";


export const Addproduct = async (req, res) => {
  //Taking Values from req.body
  try {
    const { value, error } = Productjoi.validate(req.body);
    if (error) {
      return res.status(400).json({ status: "Error", message: "erroring" });
    }
    const { ProductTitle, ProductPrice, ProductCategory, ProductDescription } =
      value;
    //Existing product identify
    const ExistingProduct = await Product.findOne({
      ProductTitle: ProductTitle,
    });
    if (ExistingProduct) {
      return res.status(400).json({ status: "PRODUCT ALREADY CREATED" });
    }
    //creating new product
    const ProductCreate = new Product({
      ProductTitle: ProductTitle,
      ProductDescription: ProductDescription,
      ProductPrice: ProductPrice,
      ProductImage: req.cloudinaryImageUrl,
      ProductCategory: ProductCategory,
    });
    await ProductCreate.save();
    return res
      .status(201)
      .json({ message: "PRODUCT CREATED SUCESSFULLY", data: ProductCreate });
  } catch (error) {
    res.status(400).json("Server Error");
  }
};



//Env Configration
dotenv.config()
//ADMIN LOGIN 
export const AdminLogin = async (req, res, next) => {
  try {
    const { ADMIN_NAME, ADMIN_PASSWORD } = req.body;

    console.log(ADMIN_NAME,ADMIN_PASSWORD);

    if (ADMIN_NAME !== process.env.ADMIN_NAME || ADMIN_PASSWORD !== process.env.ADMIN_PASSWORD) {
      return res.status(404).json({ message: "Wrong username or password" });
    } else {
      return res.status(200).json({ message: "Success login" });
    }
  } catch (error) {
    next(error);
  }
};


//View All Users In Admin
export const ViewAllUsers = async (req,res,next)=>{
  try {
    const Allusers = await User.find()
    if(Allusers.length==0){
      return res.status(404).json({message:"No users"})
    }
    return res.status(200).json(Allusers)

  } catch (error) {
    next(error)
  }
}


//view Specific User
export const SpecificUser = async (req,res,next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}