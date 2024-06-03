import { errorHandler } from "../MIDDLEWARE/Errors.js";
import Product from "../MODELS/ProductModel.js";
import User from "../MODELS/UserModel.js";

//View all products
export const AllProducts = async (req, res, next) => {
  try {
    const All = await Product.find()
      .then((Product) => {
         res.status(200).json({ Product });
      })
       .catch((error) => {
         return next(errorHandler, (404, "Unable to get Product", error));
      });
  } catch (error) {
       return next(errorHandler, (404, "Unable to get product", error));
  }
};
//find product Id used
export const FindProductById = async (req, res, next) => {
  try {
    const Productid = await Product.findById(req.params.id);
    return res.status(200).json({ Productid });
  } catch (error) {
    return res.status(400).json({ message: "Not Found Product This Id" });
  }
};
//Find product By category
export const FindByCategory = async (req, res, next) => {
  try {
    //Taking values from Url
    const { categoryname } = req.params;
    const category = await Product.find({
      //Finding Title based and category baced A-z
      $or: [
        { ProductCategory: { $regex: new RegExp(categoryname, "i") } },
        { ProductTitle: { $regex: new RegExp(categoryname, "i") } },
      ],
    }).select("ProductTitle  ProductPrice   ProductCategory");
    if (category.length === 0) {
      return res.status(404).json("NO ITEM FOUND");
    }
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(404).json("server error");
  }
};
