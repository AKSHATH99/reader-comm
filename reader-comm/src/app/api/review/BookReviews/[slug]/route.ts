import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";
import { ratingCalculator } from "@/helpers/ratingCalc";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const bookRatings = await BookModel.findById(slug).select(" Rating ");

    const bookReviews = await ReviewModel.find({ bookId: slug });

    if (!bookReviews) {
      return NextResponse.json(
        { message: "no reviews found" },
        { status: 404 }
      );
    }
    if (!bookRatings) {
      return NextResponse.json({ message: "no rating found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: " reviews fetched", bookRatings, bookReviews },
      { status: 200 }
    );

    
  } catch (error) {
    console.log(error, "Error while fething book comment");
    return NextResponse.json(
      { message: "Error while fething book comment" },
      { status: 500 }
    );
  }
}
