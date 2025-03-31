import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import BookModel from "@/model/Books";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId)
      .populate({
        path: 'ReadBookList',
        model: 'Book',
        select: 'BookName AuthorName BookCoverImage category'
      });
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { readBooks: user.ReadBookList },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching read list:", error);
    return NextResponse.json(
      { message: "Error fetching read list" },
      { status: 500 }
    );
  }
} 