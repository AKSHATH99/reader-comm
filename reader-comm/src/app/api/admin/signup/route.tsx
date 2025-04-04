import AdminModel from "@/model/Admin";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingAdmin = await AdminModel.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    // Password validation
    // if (password.length < 8) {
    //   return NextResponse.json(
    //     { message: "Password must be at least 8 characters long" },
    //     { status: 400 }
    //   );
    // }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new admin
    const newAdmin = new AdminModel({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    return NextResponse.json(
      { message: "Admin created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin signup error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}