import { v2 as cloudinary } from "cloudinary";
import stream from "stream"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (fileBuffer:any, originalName:string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: originalName },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Image upload to Cloudinary failed"));
        }
        resolve(result); // Resolve the promise with the Cloudinary result
      }
    );

    // Pipe the file buffer to the upload stream
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer); // Write buffer data to stream
    readableStream.pipe(uploadStream); // Pipe to Cloudinary's stream
  });
};



export { uploadOnCloudinary };






//--------------------THIS WORKS FOR LOCAL SERVER---------------------------------
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     //check if file path provided
//     if (!localFilePath) return null;

//     //if yes , upload
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
//     console.log("file upload success", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     //remove locally saved temporary file as the upload operation go failed
//     // fs.unlinkSync(localFilePath);
//     return null;
//   }
// };

// export { uploadOnCloudinary };