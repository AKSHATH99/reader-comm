import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
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
    
    const blog =  await BlogModel.findById(slug);
    if(!blog){
      return NextResponse.json(
        { message: "No blog found" },
        { status: 404 }
      );
    } 

    const newReview  = new ReviewModel({
      blogId:slug,
      userId: userId,
      reviewText: reviewText,
      contentType:"Blog",
      rating:rating,
      createdAt:Date.now(),
      updatedAt: Date.now(),
    })

    const addReview = await newReview.save();
    return NextResponse.json(
      { message: "Review added successfully", },
      { status: 200 }
    );

  } catch (error) {
    console.log(error, "Error while adding blog comment");
    return NextResponse.json(
      { message: "Error while adding blog comment" },
      { status: 500 }
    );
  }
}
