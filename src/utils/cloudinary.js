import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath,
        {
            resource_type: "auto",
        }
    )
    console.log("File is uploaded on cloudinary",response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) 
    throw new ApiError(500,"Error occured while uploading image from server.")
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted successfully:", result);
    return result;
  } catch (error) {
    throw new ApiError(500,"Error occured while deleting old image from server.")
  }
};

export {uploadOnCloudinary,deleteFromCloudinary}