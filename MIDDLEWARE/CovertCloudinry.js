import cloudinary from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

//configure the env file
dotenv.config();
//configure the cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
///set up  multer storage(temporary storage)
const storage = multer.diskStorage({});
const upload = multer({
  storage,
  limits: { fileSize: 2000000000 }, // 2GB file size limit
});
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        req.cloudinaryImageUrl = result.secure_url;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
};
export default uploadImage;
