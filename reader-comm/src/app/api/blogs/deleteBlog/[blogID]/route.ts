import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { NextResponse } from "next/server";

export async function POST(request: Request,{params}:{params: {blogID:string}}) {
  await dbConnect();

  try {
    const {blogID} = await params
    // const BookID  = slug 
    console.log(blogID);
    
    if (!blogID) {
      return NextResponse.json({ message: "bookid not found" }, { status: 404 });
    }

    const deletedBlog = await BlogModel.findByIdAndDelete( blogID );

   
      return NextResponse.json(
        { message: "Deleted Successfully" },
        { status: 404 }
      );
    

    // const deleteBook = await BookModel.dele
  } catch (error) {
    console.error("Error during delete", error);
    return NextResponse.json(
      { message: "An error occurred during delete" },
      { status: 500 }
    );
  }
}
