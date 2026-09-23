import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Files are held in memory (small admin uploads only — 8MB cap below) then
// streamed straight to Cloudinary, so no extra storage-adapter package is needed.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rmu-src", resource_type: "auto", ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export default cloudinary;
