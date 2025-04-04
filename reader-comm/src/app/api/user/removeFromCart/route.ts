import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { Cart } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { cartItemId , userId } = await request.json();

        if (!userId || !cartItemId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Safely handle the case where Cart might be undefined
        if (!user.Cart) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        // Filter out the item to remove
        user.Cart = user.Cart.filter((item: Cart) => (item as any)._id.toString() !== cartItemId);

        await user.save();

        return NextResponse.json(
            { message: "Item removed from cart successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return NextResponse.json(
            { message: "Error removing item from cart" },
            { status: 500 }
        );
    }
}