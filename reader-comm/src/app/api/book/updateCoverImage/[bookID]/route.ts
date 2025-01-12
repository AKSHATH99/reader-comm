import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/Cloudinary";
import { NextRequest } from "next/server";

export async function POST (req:NextRequest, {params}:{params : {bookID:string}}){
    await dbConnect();

    try{
        const formData = await req.formData();
        const {bookID } = params

        const coverImage = formData.get("CoverImage") as File;

        const book =await BookModel.findById(bookID);
        if(!book){
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
              );
        }

        if (!coverImage) {
            return NextResponse.json(
              { message: "Files missing" },
              { status: 400 }
            );
          }

        const bookCoverBuffer = await coverImage.arrayBuffer();
        const bookCoverResult: any = await uploadOnCloudinary(
            bookCoverBuffer, 
            coverImage.name
          );

          if (!bookCoverResult.url) {
            return NextResponse.json(
              { message: "File upload failed" },
              { status: 500 }
            );
          }

          book.BookCoverImage = bookCoverResult.url;
          const updatedURL = await book.save();
          if(!updatedURL){
            return NextResponse.json(
                { message: "Error while updating book cover img" },
                { status: 500 }
              );
          }

          return NextResponse.json(
            { message: `Book CoverImage has been successfully uploaded` },
            { status: 200 }
          );



    }catch(error){
        console.error("Error while updating book cover img:", error);
    `return NextResponse.json(
      { message: "Error while updating book cover img" },
      { status: 500 }
    );`
    }
}