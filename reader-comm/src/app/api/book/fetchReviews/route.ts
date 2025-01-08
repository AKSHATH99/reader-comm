import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

async function GET(req: NextApiRequest) {
  await dbConnect();

  try {
    const {bookID} = req.body;

    if(!bookID){
        return NextResponse.json(
            { message: "no book id found in req ", },
            { status: 200 }
          );
    }

    const bookReviews = await BookModel.findById(bookID).select("Reviews Rating");

    if (bookReviews) {
      return NextResponse.json(
        { message: "deleted review  successfully ",bookReviews },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error, "Error while fetching book  reviews");
    return NextResponse.json(
      { message: "Error while fetching book  reviews" },
      { status: 500 }
    );
  }
}
