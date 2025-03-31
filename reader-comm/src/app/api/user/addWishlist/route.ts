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

    // Check if book already exists in wishlist
    if (user.BookWishlist?.some(book => book.equals(bookObjectId))) {
      return NextResponse.json(
        { message: "Book already in wishlist" },
        { status: 400 }
      );
    }

    // Add book to wishlist using $addToSet to prevent duplicates
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { BookWishlist: bookObjectId } }
    );

    return NextResponse.json(
      { message: "Book added to wishlist successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding book to wishlist:", error);
    return NextResponse.json(
      { message: "Error adding book to wishlist" },
      { status: 500 }
    );
  }
}