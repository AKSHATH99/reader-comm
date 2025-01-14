import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";

export async function GET( req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const {slug} = await params;

    const UserReviews = await ReviewModel.find({userId: slug})


   
    if (UserReviews) {
      return NextResponse.json(
        { message: "fetched user reviews ",UserReviews },
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
