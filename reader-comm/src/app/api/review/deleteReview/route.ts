import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

async function POST(req: NextApiRequest) {
  await dbConnect();

  try {
    const { bookID } = req.query;

    const deleteBook = await BookModel.findByIdAndDelete(bookID);

    if (deleteBook) {
      return NextResponse.json(
        { message: "deleted review  successfully " },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error, "Error while deleting book comment");
    return NextResponse.json(
      { message: "Error while deleting book comment" },
      { status: 500 }
    );
  }
}
