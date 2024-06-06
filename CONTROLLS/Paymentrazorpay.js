import Razorpay from "razorpay"
import User from "../MODELS/UserModel.js"



//PAYMENT SECTION
export const  payment = async(req,res,next)=>{
    try {
        const userid= req.params.userid
        const user = await User.findById(userid).populate({
            path:"Cart",
            populate:{path:"UserId"}
        })
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const CartProduct= user.Cart 
        if(!CartProduct){
            return res.status(404).json({message:"Cart is empty",data:[]})
        }
        const totalamount = 0
        const totalquantity = 0
        
        const total_AQ = CartProduct.map(item =>{
            totalamount += item.ProductId.ProductPrice * item.Quantity
            totalquantity += item.Quantity
        })


        var Razorpayinstance = new Razorpay({
            key_id: ID_KEY,
            key_secret: KEY_SECRET
          });

          var options = {
            amount: totalamount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };

          instance.orders.create(options, function(err, order) {
            console.log(order);
          });
          
          
    } catch (error) {
        
    }
}