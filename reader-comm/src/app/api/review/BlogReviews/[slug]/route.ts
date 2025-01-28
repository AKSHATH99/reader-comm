import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";
import { ratingCalculator } from "@/helpers/ratingCalc";
import BlogModel from "@/model/Blog";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const blogRatings = await BlogModel.findById(slug).select(" Rating ");

    const blogReviews = await ReviewModel.find({ blogId: slug });

    if (!blogReviews) {
      return NextResponse.json(
        { message: "no reviews found" },
        { status: 404 }
      );
    }
    if (!blogRatings) {
      return NextResponse.json({ message: "no rating found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: " reviews fetched", blogRatings, blogReviews },
      { status: 200 }
    );

    
  } catch (error) {
    console.log(error, "Error while fething blog ratings");
    return NextResponse.json(
      { message: "Error while fething blog ratings" },
      { status: 500 }
    );
  }
}
