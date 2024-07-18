import { errorHandler } from "../MIDDLEWARE/Errors.js";
import Product from "../MODELS/ProductModel.js";


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
export const FindProductById = async (req, res) => {
  try {
    const { id } = req.params;
        try {
            // Find the product by ID
            const findProduct = await Product.findById(id);
            
            if (!findProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            res.status(200).json({ product: findProduct });
        } catch (error) {
            return res.status(404).json({messsage:"Unable to get products",error});
            next(error);
        }
} catch (error) {  
    return res.status(404).json({messsage:"Unable to get products",error});
 
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
    }).select("ProductTitle  ProductPrice   ProductCategory ProductDescription ProductImage");
    if (category.length === 0) {
      return res.status(404).json("NO ITEM FOUND");
    }
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(404).json("server error");
  }
};


