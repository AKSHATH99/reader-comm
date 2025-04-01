import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect()
    try {
        const books = await BookModel.find({approved:false})
        return NextResponse.json({books})
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}
