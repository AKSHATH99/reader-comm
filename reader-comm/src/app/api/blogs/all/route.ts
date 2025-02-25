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
     
        const bookDetails = await BlogModel.find({});

        if(bookDetails.length==0 ){
        return NextResponse.json("Books not found", { status: 200 });

        }
          
        return NextResponse.json(bookDetails, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during search", error);
    return NextResponse.json(
      { message: "An error occurred during search" },
      { status: 500 }
    );
    }
}