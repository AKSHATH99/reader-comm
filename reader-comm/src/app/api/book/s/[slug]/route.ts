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

        const bookDetails = await BookModel.find({BookName:slug});
          
        return NextResponse.json(bookDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during search", error);
    return NextResponse.json(
      { message: "An error occurred during search" },
      { status: 500 }
    );
    }
}