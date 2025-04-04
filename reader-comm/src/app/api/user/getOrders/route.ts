import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OrderModel from "@/model/Orders";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user's orders
    const orders = await OrderModel.find({ 
      userId: userId 
    }).sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}