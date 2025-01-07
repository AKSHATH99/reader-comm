import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { BookID } = await request.json();
    if (!BookID) {
      return NextResponse.json({ message: "bookid not found" }, { status: 404 });
    }

    const deletedbook = await BookModel.findByIdAndDelete({ BookID });

    if (deletedbook == null) {
      return NextResponse.json(
        { message: "Some error occured while deleting book" },
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
