import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
    await dbConnect();

    try {
      const { bookId } = await params;
        if (!bookId) {
          return NextResponse.json({ message: "bookid not found" }, { status: 404 });
        }

        const bookDetails = await BookModel.findById(bookId);
          
        return NextResponse.json(bookDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during fetch", error);
    return NextResponse.json(
      { message: "An error occurred during fetch" },
      { status: 500 }
    );
    }
}