import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { bookId, bookName, count, bookImage, userId } = await request.json();
    console.log(bookId, bookName, count, bookImage, userId);
    if (!userId || !bookId || !bookName || !count || !bookImage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Check if the book already exists in the user's cart
    const existingCartItem = user.Cart?.find((item) => item.BookID === bookId);

    if (existingCartItem) {
      // If the book already exists, just return a message
      return NextResponse.json(
        { message: "Item already in cart" },
        { status: 200 }
      );
    } else {
      // If the book doesn't exist, add it to the cart
      const cartItem = new mongoose.Types.ObjectId();
      user.Cart = [
        ...(user.Cart || []),
        {
          _id: cartItem,
          BookID: bookId,
          BookName: bookName,
          createdAt: new Date(),
          count: Number(count),
          BookImage: bookImage,
        } as any,
      ];

      await user.save();

    }
    return NextResponse.json(
      { message: "Item added to cart successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { message: "Error adding item to cart" },
      { status: 500 }
    );
  }
}
