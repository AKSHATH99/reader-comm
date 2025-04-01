import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";

export async function GET(request: Request,{ params }: { params: { slug: string } }) {
  await dbConnect();

  try {
    const {slug} = await params
    const  category  =slug
    console.log(category);
    
    if (!category) {
      return NextResponse.json(
        { message: "category not in request" },
        { status: 404 }
      );
    }

    const booksByCategory = await BookModel.find({category,approved:true});

    return NextResponse.json(
     booksByCategory,
      { status: 200 }
    );


  } catch (error) {
    console.error("An error occurred during fetch books  by category", error);
    return NextResponse.json(
      { message: "An error occurred during fetch books  by category" },
      { status: 500 }
    );
  }
}
