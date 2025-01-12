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
      const bookName = slug
        if (!bookName) {
          return NextResponse.json({ message: "bookname not found in params" }, { status: 404 });
        }

        const bookDetails = await BookModel.find({BookName:bookName});
          
        return NextResponse.json(bookDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during fetch", error);
    return NextResponse.json(
      { message: "An error occurred during fetch" },
      { status: 500 }
    );
    }
}