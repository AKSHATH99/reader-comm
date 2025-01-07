import { corsMiddleware } from "./src/helpers/middlewares/cors";
import upload from "@/helpers/middlewares/multer";
import { NextRequest, NextResponse } from "next/server";
import { default as nextConnect } from "next-connect";  
  

const handler = nextConnect();

// Apply CORS middleware to allow cross-origin requests
handler.use(corsMiddleware);

// Apply Multer middleware for handling file uploads
handler.use('/addbook', upload.fields([
  { name: 'bookcoverimage', maxCount: 1 }, // Handling the book cover image upload
  { name: 'bookpdf', maxCount: 1 }, // Handling the book PDF upload
]));




