import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// JWT secret key should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

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

    // Check if user exists
    console.log(username)
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create the response
    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Set JWT token in HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "An error occurred during sign-in" },
      { status: 500 }
    );
  }
}
  