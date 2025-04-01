import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/Cloudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {

    // Get FormData from the request
    const formData = await req.formData();
    
    // Extract files
    const bookCoverImage = formData.get('BookCoverImage') as File;
    const bookPdf = formData.get('bookPdf') as File;
    
    // Extract other form fields
    const BookName = formData.get('BookName') as string;
    const AuthorName = formData.get('AuthorName') as string;
    const PublishDate = formData.get('PublishDate') as string;
    const CurrentVersionPublishDate = formData.get('CurrentVersionPublishDate') as string;
    const totalPages = formData.get('totalPages') as string;
    const category = formData.get('category') as string;
    const adminPassword = formData.get('adminPassword') as string;
    const BookDescription = formData.get('BookDescription') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const available = formData.get('available') === 'true';

    console.log("Book Name:", BookName);

    // Admin validation
    const adminAuthenicationPassword = "myAdmin";
    if (adminPassword !== adminAuthenicationPassword) {
      return NextResponse.json(
        { message: "Not authorized to do this" },
        { status: 500 }
      );
    }

    // Check if book already exists
    const exisitingBook = await BookModel.findOne({
      BookName,
      AuthorName,
    });

    if (exisitingBook) {
      return NextResponse.json(
        { message: "Book already exists" },
        { status: 400 }
      );
    }

    // Check if files are present
    if (!bookCoverImage || !bookPdf) {
      return NextResponse.json(
        { message: "Files missing" },
        { status: 400 }
      );
    }

     // Upload book cover image
  const bookCoverBuffer = await bookCoverImage.arrayBuffer();
  const bookCoverResult: any = await uploadOnCloudinary(
    bookCoverBuffer, 
    bookCoverImage.name
  );

  // Upload PDF
  const bookPdfBuffer = await bookPdf.arrayBuffer();
  const bookPdfResult: any = await uploadOnCloudinary(
    bookPdfBuffer, 
    bookPdf.name
  );

  console.log("Book Cover Image URL:", bookCoverResult.url);
  console.log("Book PDF URL:", bookPdfResult.url);

  if (!bookCoverResult.url || !bookPdfResult.url) {
    return NextResponse.json(
      { message: "File upload failed" },
      { status: 500 }
    );
  }

  console.log("Book Description:", BookDescription);
  console.log("Stock:", stock);
  console.log("Available:", available);
    // Create the book entry
    const newBook = new BookModel({
      BookName,
      AuthorName,
      PublishedDate:PublishDate,
      CurrentVersionPublishDate,
      BookCoverImage: bookCoverResult.url,
      BookPDFLink:bookPdfResult.url,
      totalPages,
      category,
      BookDescription,
      stock,
      available,
      approved:false,
      // Rating: {
      //   average: 0,
      //   noOFReviews: 0,
      //   totalRating: 0
      // }
    });

    const createdBook = await newBook.save();

    if (createdBook) {
      return NextResponse.json(
        { message: "Book has been successfully uploaded" },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error while adding book details:", error);
    return NextResponse.json(
      { message: "Error while adding book details" },
      { status: 500 }
    );
  }
}