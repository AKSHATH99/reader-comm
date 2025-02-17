import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { ratingCalculator } from "@/helpers/ratingCalc";
import ReviewModel from "@/model/Reviews";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  await dbConnect();

  try {
    const { slug } = params; // ✅ No need for "await"
    const { userId, reviewText, rating } = await request.json();

    if (!userId || !reviewText || !rating) {
      return NextResponse.json({ message: "Please add required data" }, { status: 400 });
    }

    const blog = await BlogModel.findById(slug);
    if (!blog) {
      return NextResponse.json({ message: "No blog found" }, { status: 404 });
    }

    // 🚀 **Check if user already reviewed this blog**
    const existingReview = await ReviewModel.findOne({ blogId: slug, userId });
    if (existingReview) {
      return NextResponse.json({ message: "You have already reviewed this blog." }, { status: 409 });
    }

    const newReview = new ReviewModel({
      blogId: slug,
      userId,
      reviewText,
      contentType: "Blog",
      rating,
    });

    const addReview = await newReview.save();

    return NextResponse.json({ message: "Review added successfully", review: addReview }, { status: 201 });

  } catch (error) {
    console.error("Error while adding blog comment:", error);
    return NextResponse.json({ message: "Error while adding blog comment" }, { status: 500 });
  }
}
  