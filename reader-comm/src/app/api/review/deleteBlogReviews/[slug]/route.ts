import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import ReviewModel from "@/model/Reviews";
import BlogModel from "@/model/Blog";

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

    const blog = await BlogModel.findById(slug);
    if(!blog){
      return NextResponse.json(
        { message: "No blog found" },
        { status: 404 }
      );
    } 


    const deleteReview = await ReviewModel.findOneAndDelete({blogId:slug , userId:userID});
    console.log(deleteReview);

  

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log(error, "Error while deleting blog comment");
    return NextResponse.json(
      { message: "Error while deleting blog comment" },
      { status: 500 }
    );
  }
}
