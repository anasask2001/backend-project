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


//view user cart
export const ViewCart = async (req,res,next)=>{
  try {
    const{userid}=req.params
    const user = await User.findById(userid)
    .populate({
      path:"Cart",
      populate:{path:"ProductId"}
    })

console.log(user);

    if(!user){
      return res.status(404).json({message:"USER NOT FOUND"})
    }


    if(!user.Cart || user.Cart.length==0){
      return res.status(200).json({message:"Cart Is Empty",data:[]})
    }
    return res.status(200).json(user.Cart)
  } catch (error) {
    next(error)
  }
}


//increament cart item
export const IncreamentcartItem = async(req,res,next)=>{
  try {
  //Taking user id   
  const userid=req.params.userid
  //taking product id
  const productid=req.params.productid
  //taking count in body
  const {Increamentitem} = req.body
console.log(Increamentitem);
//checking userid
  if(!userid){
    return res.status(404).json({message:"USER NOT FOUND"})
  }
//checking productid
  if(!productid){
    return res.status(404).json({message:"PRODUCT NOT FOUND"})
  }
  
//finding product id and product id
  const cartitem = await Cart.findOne({userid:userid._id,productid:productid._id})
  if(cartitem){
    //not a number show alert
    if(typeof Increamentitem !== "number"){
      return res.status(404).json({message:"MUST BE NUMBERS"})
    }else{
      //otherwise Add count
      cartitem.Quantity+=Increamentitem
      await cartitem.save()
    }
  }
    res.status(200).json({message:"QUANTITY INCREAMENTED"})

  } catch (error) {
    console.error("error:",error)
    next(error)
  }
}

//Decreament cart item
export const DecreamentcartItem = async (req,res,next)=>{
  try {
    //take user id
    const userid=req.params.userid
     //take product id
    const productid=req.params.productid
    //take count body
    const {decreamnetitem } = req.body


    //check user id
    if(!userid){
      return res.status(404).json({message:"USER NOT FOUND"})
    }
   //check product id
    if(!productid){
      return res.status(404).json({message:"PRODUCT NOT FOUND"})
    }
    //finding the userid and product id
    const cartitem = await Cart.findOne({userid:userid._id,productid:productid._id})
console.log(decreamnetitem);
    if(cartitem){
      //not a number show alert
      if(typeof decreamnetitem !== "number"){
        return res.status(404).json({message:"MUST BE NUMBERS"})
      }
       if(cartitem.Quantity > 1){
        cartitem.Quantity-=decreamnetitem    
        await cartitem.save()  
      }else{
        cartitem.Quantity = 1
        await cartitem.save()  
      }
    }
    res.status(200).json({message:"QUANTITY DECREAMENTED"})
  
  } catch (error) {
    next(error)
  }
}

export const DeleteCart  = async (req,res,next)=>{
 try {
  const userid = req.params.userid
  const productid =req.params.productid

  const user = await User.findById(userid)
  if(!user){
    return res.status(404).json({message:"user not found"})
    
  }


  const product = await Product.findById(productid)
  if(!product){
    return res.status(404).json({message:"product not found"})
  }
 

 const deleteproduct = await Cart.findOneAndDelete({ UserId:user._id, ProductId:product._id})
 const cart_index = user.Cart.findIndex(item =>item.equals(deleteproduct._id))

 if(cart_index !== -1){
  user.Cart.splice(cart_index,1)
  await user.save()
  return res.status(200).json({message:"product deleted"})
 }
  
 } catch (error) {
  next(error)
 }

}
