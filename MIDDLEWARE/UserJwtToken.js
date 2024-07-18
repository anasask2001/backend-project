import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config

export const UserToken= (req,res,next)=>{
    try{
        const token =req.headers["authorization"];

        if(!token){
           return res.status(403).json({message:"token is not provided"})
        }
        jwt.verify(token,process.env.User_Token_secret_Key,(err,decode)=>{
            if(err){
                return res.status(401).json({message:"Unauthorized"})
            }
            req.email = decode.email;
            next();
        })

    }catch(error){
        return next(error)
    }
}

export default UserToken
