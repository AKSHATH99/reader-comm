import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";
import { ratingCalculator } from "@/helpers/ratingCalc";

 export async function POST(req: Request ,  {params} : {params : {slug:string}}) {
  await dbConnect();

  try {
    const {userID} = await req.json();
    const {slug} = await params;

    if(!userID || !slug ){
      return NextResponse.json(
        { message: "Please add required data" },
        { status: 404 }
      );
    }

    const book = await BookModel.findById(slug);
    if(!book){
      return NextResponse.json(
        { message: "No book found" },
        { status: 404 }
      );
    } 

    const review = await ReviewModel.findOne({bookId:slug , userId:userID});
    const ratingToBeSubtracted:any = review?.rating;

    const deleteReview = await ReviewModel.findOneAndDelete({bookId:slug , userId:userID});
    console.log(deleteReview);

    // Update new rating in the book db
    const currentTotalRating:any = book.Rating.totalRating;
    const currentNoOFReviews :any = book.Rating.noOFReviews;
    
    const newAverage = (currentTotalRating- ratingToBeSubtracted) /(currentNoOFReviews-1)
    


    const updateBookRating  = await BookModel.findByIdAndUpdate(
      {_id:slug},
      {$inc:{
        "Rating.average":newAverage,
        "Rating.noOFReviews": -1,
       " rating.totalRating ": -currentTotalRating,
      }}
    )

    if(!updateBookRating){
      return NextResponse.json(
        { message: "Review deletion error" },
        { status: 500 }
      );
    }
   

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log(error, "Error while deleting book comment");
    return NextResponse.json(
      { message: "Error while deleting book comment" },
      { status: 500 }
    );
  }
}
