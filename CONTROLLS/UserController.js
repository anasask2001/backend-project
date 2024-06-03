import { json } from "express";
import User from "../MODELS/UserModel.js";
import UserJoi from "../VALIDATION/JoiValidation.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

 // Sign up
export const SignUp = async (req, res, next) => {
  try {
     // Taking Users Datas From Body
    const { value, error } = UserJoi.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "Error", message: "Validation error" });
    }
     // Check if this user already exists
    const { UserName, Email, Password } = value;
    const ExistingUser = await User.findOne({ UserName: UserName });
    if (ExistingUser) {
      return res.status(400).json({ status: "ID USER NAME IS ALREADY TAKEN" });
    }
     // Password hashing
    const hashpassword = bcrypt.hashSync(Password, 10);
     // Save new user in database
    const NewUser = new User({
      UserName: UserName,
      Email: Email,
      Password: hashpassword,
      ProfileImg: req.cloudinaryImageUrl// Ensure ProfileImg is defined
    });
     // Save the new user
    await NewUser.save();
    return res.status(201).json({ status: "User Registration is Success" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "Server Error", message: error.message });
  }
};


// Login User
export const Login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
     // Finding the user by email
    const UserValid = await User.findOne({ Email });
    if (!UserValid) {
      return res.status(404).json("USER NOT FOUND");
    }
     // Validate password
    const ValidPass = bcrypt.compareSync(Password, UserValid.Password);
    if (!ValidPass) {
      return res.status(404).json("PASSWORD NOT MATCH");
    }
     // Generate JSON web token
    const TokenUser = jsonwebtoken.sign(
      { Email: Email, _id: UserValid._id },
      process.env.Token_secret_Key,
      { expiresIn: "1h" }
    );
    const { Password: hashpassword, ...details } = UserValid._doc;
     // Set cookies and respond
    return res
      .cookie("token", TokenUser, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "User login success jwt", details });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
