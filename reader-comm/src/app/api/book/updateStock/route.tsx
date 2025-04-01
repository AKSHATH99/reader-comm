import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const {bookId,stock} = await req.json()
        if(!bookId || !stock){
            return NextResponse.json({error:"Book ID and stock are required"},{status:400})
        }
        console.log(bookId,stock)
        const book = await BookModel.findByIdAndUpdate(bookId,{stock})
        return NextResponse.json({message:"Stock updated successfully",book})
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
    
}
