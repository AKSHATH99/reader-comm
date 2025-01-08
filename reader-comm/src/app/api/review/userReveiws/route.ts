import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

async function GET(req: NextApiRequest) {
  await dbConnect();

  try {
    const {userID} = req.user;

    const AllUserReviews = await BookModel.findById(userID).select("Reviews Rating");

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
