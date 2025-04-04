//SEARCH FUNCTION FOR Blog 

import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
    await dbConnect();

    try {
     
        const blogDetails = await BlogModel.find({}).sort({ PublishedDate: -1 });

        if(blogDetails.length==0 ){
        return NextResponse.json("Blogs not found", { status: 200 });

        }
          
        return NextResponse.json(blogDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during search", error);
    return NextResponse.json(
      { message: "An error occurred during search" },
      { status: 500 }
    );
    }
}