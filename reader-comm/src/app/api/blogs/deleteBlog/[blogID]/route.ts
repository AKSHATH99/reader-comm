import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { NextResponse } from "next/server";

export async function POST(request: Request,{params}:{params: {blogID:string}}) {
  await dbConnect();

  try {
    const {blogID} = await params
    // const BookID  = slug 
    if (!blogID) {
      return NextResponse.json({ message: "bookid not found" }, { status: 404 });
    }

    const deletedBlog = await BlogModel.findByIdAndDelete({ blogID });

    if (deletedBlog == null) {
      return NextResponse.json(
        { message: "Some error occured while deleting blog" },
        { status: 404 }
      );
    }

    // const deleteBook = await BookModel.dele
  } catch (error) {
    console.error("Error during delete", error);
    return NextResponse.json(
      { message: "An error occurred during delete" },
      { status: 500 }
    );
  }
}
