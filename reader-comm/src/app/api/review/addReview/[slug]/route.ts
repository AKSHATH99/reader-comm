import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { ratingCalculator } from "@/helpers/ratingCalc";

export async function POST(request: Request , {params} : {params : {slug:string}}) {
  await dbConnect();

  try {

    const {slug} = await params;
    const {userId , reviewText , rating} = await request.json();

    if(!userId || !reviewText || !rating){
      return NextResponse.json(
        { message: "Please add required data" },
        { status: 404 }
      );
    }

    const Book = await BookModel.findById(slug);
    if(!Book){
      return NextResponse.json(
        { message: "No book found" },
        { status: 404 }
      );
    }

    const currentTotalRating:any  = Book.Rating.totalRating;
    const currentNoOFReviews :any= Book.Rating.noOFReviews;

    // Pass in user's rating and old review-count and old total-rating to get updated data for new rating field 
    const [newAverage , NewTotalRating , newnoOFReviews] = ratingCalculator(rating , currentNoOFReviews , currentTotalRating );

    const newReview = {
      userId: userId,
      reviewText: reviewText,
      rating: rating,
      createdAt: new Date()
    };

    const addReview = await BookModel.findByIdAndUpdate(slug ,
      {
        $push:{Reviews:newReview},
        $set:{
          'Rating.average':newAverage,
          'Rating.noOFReviews': newnoOFReviews,
          'Rating.totalRating': NewTotalRating
        }
      },
      {new:true , runValidators:true}
    )

    
    return NextResponse.json(
      { message: "Review added successfully", book: addReview },
      { status: 200 }
    );

  } catch (error) {
    console.log(error, "Error while adding book comment");
    return NextResponse.json(
      { message: "Error while adding book comment" },
      { status: 500 }
    );
  }
}
