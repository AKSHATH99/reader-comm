import BlogModel from "@/model/Blog";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { blogID: string } }
) {
    await dbConnect();

    try {
      const { blogID } = await params;
        if (!blogID) {
          return NextResponse.json({ message: "Blog id not found" }, { status: 404 });
        }

        const blog = await BlogModel.findById(blogID);

        let currentLikeCount :any = blog?.Rating?.noOfLikes;
        const newLikeCount = currentLikeCount+1

        const addLike = await BlogModel.findByIdAndUpdate(blogID,
            { $inc: { "Rating.noOfLikes": 1 } },
            {new:true}
        )
        
        return NextResponse.json(addLike, { status: 200 });
        
    
    } catch (error) {
        console.error("Error during fetch", error);
    return NextResponse.json(
      { message: "An error occurred during fetch" },
      { status: 500 }
    );
    }
}