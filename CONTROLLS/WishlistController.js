import Product from "../MODELS/ProductModel.js";
import User from "../MODELS/UserModel.js";
import Wishlist from "../MODELS/WishlistModel.js";



//Adding the product Wishlist
export const AddtoWishlist = async (req,res,next)=>{
    try {

     const {userid,productid}=req.params

     const user = await User.findById(userid)
     if(!user){
        return res.status(404).json({message:"user not found"})
     } 


     const product = await Product.findById(productid)
     if(!product){
        return res.status(404).json({message:"product not found"})
     }
   

     let WishlistItem = await Wishlist.findOne({UserId:user._id,ProductId:product._id})
  
     if(WishlistItem){
        return res.status(200).json({message:"Already added Wishlist"})
     }else{
        WishlistItem = await Wishlist.create({
            UserId:userid,
            ProductId:productid,
            Quantity:1
        })
      user.Wishlist.push(WishlistItem._id)
      await user.save()
       return res.status(200).json({message:"Wishlist added",WishlistItem})
     }
   
    } catch (error) {
        next(error)
    }
}
 
//Viewing users Wishlist
export const ViewWishlist = async (req,res,next)=>{
    try {
        const {userid} = req.params;
        const user = await User.findById(userid).populate({
            path:"Wishlist",
            populate:{path:"ProductId"}
        })
       

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        if(!user.Wishlist){
           return res.status(200).json({message:"Wishlist item empty",data:[]})
        } 
        return res.status(200).json(user.Wishlist)

        
    } catch (error) {

        next(error)
        
    }
}

//Deleting the product Wishlist
export const DeleteWishlist = async (req,res,next)=>{
    try {
        const{userid,productid}=req.params
        const user = await User.findById(userid)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const product = await Product.findById(productid)
        if(!product){
            return res.status(404).json({message:"product not found"})
        }

        const DeleteWishlist = await Wishlist.findOneAndDelete({UserId:user._id,ProductId:product._id})
        const Wishlist_index =  await user.Wishlist.findIndex(item=>item.equals(DeleteWishlist._id))
        if(Wishlist_index!==-1){
            user.Wishlist.splice(Wishlist_index,1)
            await user.save()
            return res.status(200).json({message:"product deleted"})
        }

     

    } catch (error) {
        
    }
}
