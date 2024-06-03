import Cart from "../MODELS/CartModels.js";
import Product from "../MODELS/ProductModel.js";
import User from "../MODELS/UserModel.js";

//Add to cart Function
export let AddToCart = async (req, res, next) => {
  try {
    //take userid and product id
    let UserId = req.params.userid;
    let ProductId = req.params.productid;
    //finding userid
    const user = await User.findById(UserId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    //finding productid
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(404).status({ message: "Product Not Found" });
    }
    // Find the product exstind added
    let Cartproduct = await Cart.findOne({
      UserId: UserId,
      ProductId: ProductId,
    });
    console.log(Cartproduct);
    if (Cartproduct) {
      //If product is already carted only add the quatity increament
      Cartproduct.Quantity++;
      await Cartproduct.save();
      return res.status(201).json({ message: "Product Cart Is Increamented" });
    } else {
      //Other wise create a new product Cart
      Cartproduct = await Cart.create({
        UserId,
        ProductId,
        Quantity: 1,
      });
      //push the cart Item user cart
      user.Cart.push(Cartproduct._id);
      //saving the cart to user
      await user.save();
      return res
        .status(200)
        .json({ message: "Product Is carted Successfully" });
    }
  } catch (error) {
    return next(error);
  }
};
