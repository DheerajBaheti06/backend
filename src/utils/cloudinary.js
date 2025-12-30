import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
dotenv.config({
  path: "../config/config.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary.
 *
 * @param {string} localFilePath - Path to the local file to upload
 * @param {string} folder - (Optional) Folder name in Cloudinary (default: "others")
 * @returns {Promise<Object|null>} Cloudinary response object or null on failure
 */
const uploadOnCloudinary = async (localFilePath, folder = "others") => {
  try {
    if (!localFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });

    // File uploaded successfully, clean up local temp file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Attempt to clean up local file if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error(
        "Error deleting local file after failed upload:",
        unlinkError
      );
    }
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

/**
 * Delete a file from the local filesystem.
 * Useful for cleanup when validation fails.
 *
 * @param {string} localFilePath - Path to file
 */
const deleteLocalFile = (localFilePath) => {
  try {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  } catch (error) {
    console.error("Error while deleting local file:", error);
  }
};

export { uploadOnCloudinary, deleteLocalFile };
