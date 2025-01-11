// src/lib/Cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadOnCloudinary(buffer: ArrayBuffer, filename: string) {
  console.log(  process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET);
  
  try {
    // Convert ArrayBuffer to Buffer
    const fileBuffer = Buffer.from(buffer);
    
    // Create a promise to handle the upload
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'books',
          resource_type: 'auto', // This allows both images and PDFs
          use_filename: true,
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}