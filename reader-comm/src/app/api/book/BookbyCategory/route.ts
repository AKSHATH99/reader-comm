import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";


export async function GET(request : Request){
    await dbConnect();

    try {
        const { categoy} = await request.json();
        if (!categoy) {
          return NextResponse.json({ message: "bookid not found" }, { status: 404 });
        }

        const booksByCategory = await BookModel.find(categoy);
        if(!booksByCategory){
            return NextResponse.json(
                { message: "Couldnt fetch books" },
                { status: 404 }
              );
        }

        
    } catch (error) {
        console.error("Error during fetch books", error);
    return NextResponse.json(
      { message: "An error occurred during fetch books" },
      { status: 500 }
    );
    }
}