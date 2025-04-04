import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userId } = await request.json(); // Assuming user ID is sent in headers

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Safely handle the case where Cart might be undefined
        if (!user.Cart) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 200 });
        }

        return NextResponse.json(
            { message: "Cart items retrieved successfully", cart: user.Cart },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving cart items:", error);
        return NextResponse.json(
            { message: "Error retrieving cart items" },
            { status: 500 }
        );
    }
}