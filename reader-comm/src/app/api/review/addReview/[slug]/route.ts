import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { ratingCalculator } from "@/helpers/ratingCalc";
import ReviewModel from "@/model/Reviews";

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
    
    const book =  await BookModel.findById(slug);
    if(!book){
      return NextResponse.json(
        { message: "No book found" },
        { status: 404 }
      );
    } 

    const newReview  = new ReviewModel({
      bookId:slug,
      userId: userId,
      reviewText: reviewText,
      rating:rating,
      createdAt:Date.now(),
      updatedAt: Date.now(),
    })

    const addReview = await newReview.save();

    if(addReview){
      console.log(addReview.rating);

      const newRating = addReview.rating;
      // const currentAverage = book.Rating.average;
      const currentTotalRating:any = book.Rating.totalRating;
      const currentNoOFReviews:any = book.Rating.noOFReviews;

      const [avgRating , newTotalRating , newnoOFReviews] = ratingCalculator(newRating , currentNoOFReviews , currentTotalRating)

      const updatedBookRating = await  BookModel.findByIdAndUpdate(
        {_id:slug},
        {$set :{
          "Rating.average":avgRating,
          "Rating.noOFReviews": newnoOFReviews,
         " rating.totalRating ": newTotalRating,

        }}
      )

      console.log(updatedBookRating);
      
    }

    

    return NextResponse.json(
      { message: "Review added successfully", },
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
