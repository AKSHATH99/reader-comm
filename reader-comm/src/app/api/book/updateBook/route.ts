// Sample request 
// // {
//   "bookId": "64cfb10f9b0e2a4567a8c123",
//   "adminPassword": "your_admin_password",
//   "updates": {
//     "BookName": "Updated Book Name",
//     "AuthorName": "Updated Author",
//     "category": "New Category"
//   }
// }


import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();


  try {
    const {BookID , updates } = await request.json();
    if(!BookID){
      return NextResponse.json({ message: "bookid not found" }, { status: 404 });

    }

    const book:any = await BookModel.findById(BookID);
    if(!book){
      return NextResponse.json({ message: "book not found" }, { status: 404 });

    }

    Object.keys(updates).forEach((key)=>{
      if (book[key] !== undefined) {
        book[key] = updates[key];
      }
    })

    const updatedBook = await book.save();

    return NextResponse.json(
      { message: "Book updated successfully.", updatedBook },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { message: "Error updating book details." },
      { status: 500 }
    );
  }

    

}

