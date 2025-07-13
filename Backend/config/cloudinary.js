import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {
    // Ensure credentials are present
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_CLOUD_API_KEY ||
      !process.env.CLOUDINARY_CLOUD_API_SECRET
    ) {
      throw new Error("Missing Cloudinary configuration in environment variables");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
      api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  } finally {
    // Ensure file is deleted in any case
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      console.warn("Failed to delete file:", filePath, unlinkErr);
    }
  }
};

export default uploadOnCloudinary;
