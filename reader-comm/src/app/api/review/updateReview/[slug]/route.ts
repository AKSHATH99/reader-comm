import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";

 export async function POST(req: Request ,  {params} : {params : {slug:string}}) {
  await dbConnect();

  try {
    const { slug } = await params;
    const { userId, reviewText, rating } = await req.json();

    if(!userId || !slug || !reviewText|| !rating ){
      return NextResponse.json(
        { message: "Please add required data" },
        { status: 404 }
      );
    }

    const book = await BookModel.findById(slug);
    if(!book){
        return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
          );
    }

    const review = await ReviewModel.findOne({bookId:slug , userId:userId});
    const ratingToBeSubtracted:any = review?.rating
    const reviewID = review?._id;
   
    const updatedReview = await ReviewModel.findByIdAndUpdate(
      {_id:reviewID},
      {
        $set:{
          "reviewText":reviewText,
          "rating":  rating
        }
      }
    );

    if(updatedReview){

      const currentTotalRating:any = book.Rating.totalRating;
      const currentNoOFReviews :any = book.Rating.noOFReviews;

      let newTotalRating = (currentTotalRating- ratingToBeSubtracted ) + rating;
      let newAverage = newTotalRating/currentNoOFReviews;

      if(newTotalRating< 0){
        newTotalRating =0;
      }
      if(newAverage<0){
        newAverage = 0;
      }

      const updateBookRating =  await BookModel.findByIdAndUpdate(
        {_id:slug},
        {
          $set:{
            "Rating.average":newAverage,
            "Rating.totalRating":newTotalRating
          }
        }
      ) 
    }

    return NextResponse.json(
      { done : "Successfull update review" },
      { status: 200 }
    );


  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
