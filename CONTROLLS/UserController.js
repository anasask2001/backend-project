import User from "../MODELS/UserModel.js";
import UserJoi from "../VALIDATION/JoiValidation.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

// Sign up
export const SignUp = async (req, res, next) => {
  try {
    // Validate user data from request body
    const { value, error } = UserJoi.validate(req.body);

    if (error) {
      return res.status(400).json({ status: "Error", message: "Validation error", details: error.details });
    }

    // Extract validated data
    const { UserName, Email, Password, ConfirmPassword} = value;

    // Check if user already exists
    const existingUser = await User.findOne({ Email: Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already taken" });
    }

    // Check if passwords match
    if (Password !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(Password, 10);

    // Create new user
    const newUser = new User({
      UserName: UserName,
      Email: Email,
      Password: hashedPassword,
      ProfileImg: req.cloudinaryImageUrl 
    });

    // Save new user to database
    await newUser.save();
    // Respond with success message
    return res.status(200).json({ message: "User registration is successful" });

  } catch (error) {
    return res.status(500).json({ status: "Error", message: "Internal server error", details: error.message });
  }
};

// Login User
export const Login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
     // Finding the user by email
    const UserValid = await User.findOne({ Email });
    if (!UserValid) {
      return res.status(404).json({message:"USER NOT FOUND"});
    }
     // Validate password
    const ValidPass = bcrypt.compareSync(Password, UserValid.Password);
    if (!ValidPass) {
      return res.status(404).json({message:"Wrong username or password"});
    }
     // Generate JSON web token
    const TokenUser = jsonwebtoken.sign(
      { Email: Email, _id: UserValid._id },
      process.env.User_Token_secret_Key,
      { expiresIn: "1h" }
    );
    const { Password: hashpassword, ...details } = UserValid._doc;
     // Set cookies and respond
    return res
      .cookie("usertoken", TokenUser, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .status(200) 
      .json({ message: "User Login Sucess", TokenUser,details });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//getting orders in each users

export const userorder = async (req, res, next) => {
  try {
    const userid = req.params.userid;
    // Fetch the user and populate orders and products
    const user = await User.findById(userid).populate({
      path: 'Order',
      populate: {
        path: 'Products.ProductId',
        model: 'Product'
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with this ID" });
    }

    if (!user.Order || user.Order.length === 0) {
      return res.status(200).json({ message: "You have no orders" });
    }

    return res.status(200).json(user.Order);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "An error occurred while fetching orders", error: error.message });
  }
};