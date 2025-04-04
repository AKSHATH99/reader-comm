import UserModel, { Cart } from "@/model/User";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userId, cartItemId, count } = await request.json();

        if (!userId || !cartItemId || !count) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await UserModel.findById(userId);
        
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.Cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        const cartItem = user.Cart?.find((item: Cart) => item._id.toString() === cartItemId);
        
        if (!cartItem) {
            return NextResponse.json(
                { message: 'Book not found in cart' },
                { status: 404 }
            );
        }

        cartItem.count = count;
        await user.save();

        return NextResponse.json({ message: "Cart count updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating cart count:", error);
        return NextResponse.json({ message: "Error updating cart count" }, { status: 500 });
    }
}