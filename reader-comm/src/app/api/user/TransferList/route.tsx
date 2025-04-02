import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { Types } from 'mongoose';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId, bookId } = await request.json();

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Fix: Compare string representations of ObjectIds
    if (user.BookWishlist && user.BookWishlist.length > 0) {
      user.BookWishlist = user.BookWishlist.filter(id => 
        id.toString() !== bookId.toString()
      );
    }
    
    // Add book to ReadBookList if not already present
    if (!user.ReadBookList?.some(id => id.toString() === bookId.toString())) {
      user.ReadBookList = [...(user.ReadBookList || []), new Types.ObjectId(bookId)];
    }

    await user.save();

    return NextResponse.json(
      { 
        message: 'Book transferred successfully',
        wishlist: user.BookWishlist,
        readBooks: user.ReadBookList
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error transferring list:', error);
    return NextResponse.json(
      { message: 'Failed to transfer list', error: (error as Error).message },
      { status: 500 }
    );
  }
}