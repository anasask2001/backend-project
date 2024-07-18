import Productjoi from "../VALIDATION/ProductJoiValidation.js";
import Product from "../MODELS/ProductModel.js";
import dotenv from "dotenv";
import User from "../MODELS/UserModel.js";
import OrderDetiles from "../MODELS/Orders.js";
import jsonwebtoken from  "jsonwebtoken"

export const Addproduct = async (req, res) => {
  //Taking Values from req.body
  try {
    const { value, error } = Productjoi.validate(req.body);
  
    if (error) {
      return res.status(400).json({ status: "Error", message: "erroring" });
    }
    const { ProductTitle, ProductDescription, ProductPrice, ProductCategory } =value;
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
      ProductCategory: ProductCategory,
      ProductImage:req.cloudinaryImageUrl,
    });
    await ProductCreate.save();
    return res
      .status(201)
      .json({ message: "PRODUCT CREATED SUCESSFULLY" });
  } catch (error) {
    res.status(400).json("Server Error");
  }
};



dotenv.config();

// ADMIN LOGIN
export const AdminLogin = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    if (
      Email !== process.env.Email ||
      Password !== process.env.Password
    ) {
      return res.status(404).json({ message: "Wrong username or password" });
    }

    const admintoken = jsonwebtoken.sign(
      { Email : Email }, // Payload
      process.env.ADMIN_JWT_SECRET_KEY, // Secret Key
      { expiresIn: "1h" } // Options
    );

    return res
      .cookie("admintoken", admintoken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "User Login Success", admintoken });
  } catch (error) {
    next(error);
  }
};

//View All Users In Admin
export const ViewAllUsers = async (req, res, next) => {
  try {
    const Allusers = await User.find();
    if (Allusers.length == 0) {
      return res.status(404).json({ message: "No users" });
    }
    return res.status(200).json(Allusers);
  } catch (error) {
    next(error);
  }
};

//view Specific User
export const SpecificUser = async (req, res, next) => {
  try {
    const userid = req.params.userid;

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not Found in this id" });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Showing All products in Admin
export const ShowProducts = async (req, res, next) => {
  try {
    const AllProducts = await Product.find();
    if (AllProducts.length == 0) {
      return res.status(404).json({ message: "No Products Found" });
    }
    return res.status(200).json(AllProducts);
  } catch (error) {
    next(error);
  }
};

//Show Specific Product
export const Specificproduct = async (req, res, next) => {
  try {
    const ProductId = req.params.productid;
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

//Show Products By Category
export const ShowCategory = async (req, res, next) => {
  try {
    const category = req.query.category;

    console.log(category);
    const product = await Product.find({
      $or: [{ ProductCategory: { $regex: new RegExp(category, "i") } }],
    });
    if (product.length == 0) {
      res.status(404).json({ message: "no product is found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched products detail.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

//deleteproduct
export const DeleteProduct = async (req, res, next) => {
  try {
    const productid = req.params.productid;
  
    const product = await Product.findOneAndDelete({ _id: productid });
    if (!product) {
      return res.status(404).json({ message: "Product not found with this ID" });
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};


//UpdateProduct
export const UpdateProduct = async (req, res, next) => {
  try {

    const productid = req.params.productid;
    const UpdateProduct = await Product.findById(productid);
    const { ProductTitle, ProductDescription, ProductPrice, ProductCategory } = req.body;
    
    if (ProductTitle) {
      UpdateProduct.ProductTitle = ProductTitle;
    }
    if (ProductDescription) {
      UpdateProduct.ProductDescription = ProductDescription;
    }
    if (ProductPrice) {
      UpdateProduct.ProductPrice = ProductPrice;
    }
    if (ProductCategory) {
      UpdateProduct.ProductCategory = ProductCategory;
    }
    // if (req.cloudinaryImageUrl) {
    //   UpdateProduct.ProductImage = req.cloudinaryImageUrl;
    // }
   
    await UpdateProduct.save();

    return res.status(200).json({ message: "product updated sucessfully" ,UpdateProduct});
  } catch (error) {
    next(error);
  }
};

//Showorders All in Admin
export const ShowAllOrder = async (req, res, next) => {
  try {
    const AllOrders = await OrderDetiles.find();
    if (!AllOrders) {
      return res.status(404).json({ message:"no orders found" });
    }
    return res.status(200).json(AllOrders);
  } catch (error) {
    next(error);
  }
};




//Total order revenue and purchase
export const status = async (req, res, next) => {
  try {
    const totalStats = await OrderDetiles.aggregate([
      {
        $group: {
          _id: null,
          totalProduct: { $sum: { $size:"$Products" } }, 
          totalRevenue: { $sum: "$TotalPrice" }
        }
      }
    ]);

    if (totalStats.length > 0) {
      res.status(200).json({ status: "Success", data: totalStats[0] });
    } else {
      res.status(200).json({
        status: "Success",
        data: { totalProduct: 0, totalRevenue: 0 }
      });
    }
  } catch (error) {
    return next(error);
  }
};