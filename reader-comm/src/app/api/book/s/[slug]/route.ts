//SEARCH FUNCTION FOR BOOK 

import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
      const { slug } = await params;
        if (!slug) {
          return NextResponse.json({ message: "Bookname not found in request" }, { status: 404 });
        }

        const regex = new RegExp(`^${slug}`, "i");
        const bookDetails = await BookModel.find({ BookName: { $regex: regex } }).select(
          " _id BookName AuthorName PublishedDate BookCoverImage totalPages category Rating"
        );

        if(bookDetails.length==0 ){
        return NextResponse.json("Books not found", { status: 200 });

        }
          
        return NextResponse.json(bookDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during search", error);
    return NextResponse.json(
      { message: "An error occurred during search" },
      { status: 500 }
    );
    }
}