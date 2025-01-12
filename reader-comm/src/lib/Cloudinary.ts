// src/lib/Cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export async function uploadOnCloudinary(buffer: ArrayBuffer, filename: string) {
//   console.log(  process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET);

//   try {
//     // Convert ArrayBuffer to Buffer
//     const fileBuffer = Buffer.from(buffer);

//     // Create a promise to handle the upload
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           folder: 'books',
//           resource_type: 'raw', // This allows both images and PDFs
//           use_filename: true,
//           unique_filename: false
//         },
//         (error, result) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(result);
//           }
//         }
//       ).end(fileBuffer);
//     });
//   } catch (error: any) {
//     console.error("Cloudinary upload error:", error);
//     throw error;
//   }
// }

export async function uploadOnCloudinary(
  buffer: ArrayBuffer,
  filename: string
) {
  try {
    const fileBuffer = Buffer.from(buffer);

    const sanitizedFilename = filename
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .toLowerCase(); // Optional: Normalize filename (e.g., lowercase)

    const filenameWithExtension = sanitizedFilename.endsWith(".pdf")
      ? sanitizedFilename
      : `${sanitizedFilename}.pdf`;

    if (
      sanitizedFilename.endsWith("png") ||
      sanitizedFilename.endsWith("jpg") ||
      sanitizedFilename.endsWith("jpeg")
    ) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "books",
              resource_type: "image", // For non-image files like PDFs
              public_id: filename, // Set public_id without the .pdf duplication
              use_filename: true,
              unique_filename: false, // Preserve filename without random suffix
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(fileBuffer);
      });
    } else {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "books",
              resource_type: "auto", // For non-image files like PDFs
              public_id: filenameWithExtension.split(".pdf")[0], // Set public_id without the .pdf duplication
              use_filename: true,
              unique_filename: false, // Preserve filename without random suffix
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(fileBuffer);
      });
    }

    // Create a promise to handle the upload
    // return new Promise((resolve, reject) => {
    //   cloudinary.uploader
    //     .upload_stream(
    //       {
    //         folder: "books",
    //         resource_type: "raw", // For non-image files like PDFs
    //         public_id: filenameWithExtension.split(".pdf")[0], // Set public_id without the .pdf duplication
    //         use_filename: true,
    //         unique_filename: false, // Preserve filename without random suffix
    //       },
    //       (error, result) => {
    //         if (error) {
    //           console.error("Cloudinary upload error:", error);
    //           reject(error);
    //         } else {
    //           resolve(result);
    //         }
    //       }
    //     )
    //     .end(fileBuffer);
    // });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
