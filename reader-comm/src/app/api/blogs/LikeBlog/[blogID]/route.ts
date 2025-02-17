import BlogModel from "@/model/Blog";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function POST(
  request: NextRequest,
  { params }: { params: { blogID: string } } // Correct destructuring
) {
    await dbConnect();

    try {
      const { blogID } = await params;
      console.log(blogID);
      
        if (!blogID) {
          return NextResponse.json({ message: "Blog id not found" }, { status: 404 });
        }

        const blog = await BlogModel.findById(blogID);
        console.log((blog));
        

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