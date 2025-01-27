import BlogModel from "@/model/Blog";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
    await dbConnect();

    try {
      const { userID } = await params;
        if (!userID) {
          return NextResponse.json({ message: "user id not found" }, { status: 404 });
        }

        const blog = await BlogModel.find({AuthorID:userID});
          
        return NextResponse.json(blog, { status: 200 });
        

    
    } catch (error) {
        console.error("Error during fetch", error);
    return NextResponse.json(
      { message: "An error occurred during fetch" },
      { status: 500 }
    );
    }
}