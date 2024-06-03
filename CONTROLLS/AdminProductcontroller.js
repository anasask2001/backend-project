import Productjoi from "../VALIDATION/ProductJoiValidation.js";
import Product from "../MODELS/ProductModel.js";

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
