import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { ratingCalculator } from "@/helpers/ratingCalc";

async function POST(request: NextApiRequest) {
  await dbConnect();

  try {
    const { bookID } = request.query;
    const { reviewText, newUserRating } = request.body;
    const userId = (request as any).user;

    const book = await BookModel.findById(bookID);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    //Calculate rating
    const noOFReviews = book.Rating[1] + 1; //new review
    const totalRating = book.Rating[2]; //sum of all rating

    const newReviewData: number[] = ratingCalculator(
      newUserRating,
      noOFReviews,
      totalRating
    );
    const avgRating = newReviewData[0];
    const newTotalRating = newReviewData[1];

    //Add data to db
    book.Rating[0] = avgRating;
    book.Rating[1] = book.Rating[1] + 1;
    book.Rating[2] = newTotalRating;
    book.Reviews[0] = userId;
    book.Reviews[1] = reviewText;
    book.Reviews[2] = newUserRating;

    const saveReviewData = await book.save();

    if (!saveReviewData) {
      return NextResponse.json(
        { message: "couldnt add review" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error, "Error while adding book comment");
    return NextResponse.json(
      { message: "Error while adding book comment" },
      { status: 500 }
    );
  }
}
