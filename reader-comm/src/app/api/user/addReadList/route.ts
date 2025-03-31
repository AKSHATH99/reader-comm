import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId, bookId } = await request.json();

    if (!userId || !bookId) {
      return NextResponse.json(
        { message: "User ID and Book ID are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Convert bookId to ObjectId
    const bookObjectId = new Types.ObjectId(bookId);

    // Check if book already exists in read list
    if (user.ReadBookList?.some(book => book.equals(bookObjectId))) {
      return NextResponse.json(
        { message: "Book already in read list" },
        { status: 400 }
      );
    }

    // Add book to read list using $addToSet to prevent duplicates
    await UserModel.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { ReadBookList: bookObjectId },
        $inc: { noOFBookRead: 1 } // Increment the number of books read
      }
    );

    return NextResponse.json(
      { message: "Book added to read list successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding book to read list:", error);
    return NextResponse.json(
      { message: "Error adding book to read list" },
      { status: 500 }
    );
  }
}