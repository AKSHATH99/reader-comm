import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

 export async function POST(req: Request ,  {params} : {params : {slug:string}}) {
  await dbConnect();

  try {
    const { slug } = await params;
    const { userId, reviewText, rating } = await req.json();

    const book = await BookModel.findById(slug);
    if(!book){
        return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
          );
    }

    // -------------------------------Delete the existing review --------------------------------
    const review = book?.Reviews.find(r => r.userId.toString() == userId);
    // console.log(review);
    
    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    const subtractRating = review.rating;
    
    const deleteReview = await BookModel.updateOne(
      { _id: slug },
      {
        $pull: {
          Reviews: {
            userId: userId
          }
        },
        $inc: {
          'Rating.noOFReviews': -1,
          'Rating.totalRating': -subtractRating
        }
      }
    );

    //------------------------ADD new review-------------------------
    

  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
