import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";


export async function GET(request : Request){
    await dbConnect();

    try {
        const { BookID } = await request.json();
        if (!BookID) {
          return NextResponse.json({ message: "bookid not found" }, { status: 404 });
        }

        const bookDetails = await BookModel.findById(BookID);
        if(!bookDetails){
            return NextResponse.json(
                { message: "Couldnt fetch book details" },
                { status: 404 }
              );
        }

    
    } catch (error) {
        console.error("Error during fetch", error);
    return NextResponse.json(
      { message: "An error occurred during fetch" },
      { status: 500 }
    );
    }
}