import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const userID = url.searchParams.get('userID');
    const bookID = url.searchParams.get('bookID');


    const book = await BookModel.findById(bookID);
    if(!book){
      return NextResponse.json(
        { message: "Book not found " },
        { status: 404 }
      );
    }

    const AllUserReviews = await BookModel.find({"Reviews.userId":userID});
    console.log(AllUserReviews[0].Reviews);
    
    
    if (AllUserReviews) {
      return NextResponse.json(
        { message: "fetched user reviews ",AllUserReviews },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error, "Error while fetching user comment");
    return NextResponse.json(
      { message: "Error while fetching user comment" },
      { status: 500 }
    );
  }
}
