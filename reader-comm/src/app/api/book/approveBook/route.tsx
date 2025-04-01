import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const {bookId} = await req.json()
        const book = await BookModel.findByIdAndUpdate(bookId,{approved:true})
        return NextResponse.json({message:"Book approved successfully"})
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}
    