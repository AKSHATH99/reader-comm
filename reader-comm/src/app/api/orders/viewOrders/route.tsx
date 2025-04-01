import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Orders";

export async function GET(req: NextRequest) {
    await dbConnect()
    try {
        const orders = await OrderModel.find()
        return NextResponse.json({orders})
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}
