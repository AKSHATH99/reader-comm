import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/Cloudinary";
import { NextRequest } from "next/server";  

export async function POST (req:NextRequest, {params}:{params : {bookID:string}}){
    await dbConnect();

    try{
        const formData = await req.formData();
        const {bookID } = await params

        const pdf = formData.get("pdf") as File;

        const book =await BookModel.findById(bookID);
        if(!book){
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
              );
        }

        if (!pdf) {
            return NextResponse.json(
              { message: "Files missing" },
              { status: 400 }
            );
          }

        const pdfBuffer = await pdf.arrayBuffer();
        const pdfResult: any = await uploadOnCloudinary(
            pdfBuffer, 
            pdf.name
          );

          if (!pdfResult.url) {
            return NextResponse.json(
              { message: "File upload failed" },
              { status: 500 }
            );
          }

          book.BookPDFLink = pdfResult.url;
          const updatedURL = await book.save();
          if(!updatedURL){
            return NextResponse.json(
                { message: "Error while updating book pdf " },
                { status: 500 }
              );
          }

          return NextResponse.json(
            { message: `Book pdf has been successfully uploaded` },
            { status: 200 }
          );



    }catch(error){
        console.error("Error while updating book pdf:", error);
    `return NextResponse.json(
      { message: "Error while updating book pdf" },
      { status: 500 }
    );`
    }
}