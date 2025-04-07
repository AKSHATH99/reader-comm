import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { bookId, bookName, count, bookImage, userId, price } = await request.json();
    console.log(bookId, bookName, count, bookImage, userId, price);
    if (!userId || !bookId || !bookName || !count || !bookImage || !price) {
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

      // Ensure existing cart items have price field (default to 0 if missing)
    const existingCart = user.Cart || [];
    const updatedExistingCart = existingCart.map(item => ({
      ...item,
      price: item.price || 0
    }));

      user.Cart = [
        ...updatedExistingCart,
        {
          _id: cartItem,
          BookID: bookId,
          BookName: bookName,
          createdAt: new Date(),
          count: Number(count),
          BookImage: bookImage,
          price: Number(price),
        } as any,
      ];
      console.log("Cart item added:", user.Cart);


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
