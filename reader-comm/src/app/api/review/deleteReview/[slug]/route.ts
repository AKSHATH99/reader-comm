import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

 export async function POST(req: Request ,  {params} : {params : {slug:string}}) {
  await dbConnect();

  try {
    const {userID} = await req.json();
    const {slug} = await params;

    const book = await BookModel.findById(slug)

  // book?.Reviews.map((r)=>{
  //   console.log(r.userId.toString())
  // })
    console.log(userID);
    console.log(slug);
    
    const review = book?.Reviews.find(r => r.userId.toString() == userID);
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
            userId: userID
          }
        },
        $inc: {
          'Rating.noOFReviews': -1,
          'Rating.totalRating': -subtractRating
        }
      }
    );

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
