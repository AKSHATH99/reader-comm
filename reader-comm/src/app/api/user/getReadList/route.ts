import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";
import BookModel from "@/model/Books";
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

    await dbConnect();

    // Make sure BookModel is imported before using populate
    await BookModel.findOne(); // This ensures the model is registered

    const user = await UserModel.findById(userId)
      .populate({
        path: 'ReadBookList',
        model: BookModel
      });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      readBooks: user.ReadBookList || []
    });

  } catch (error) {
    console.error("Error fetching read list:", error);
    return NextResponse.json(
      { message: "Error fetching read list" },
      { status: 500 }
    );
  }
}