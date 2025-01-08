import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    await dbConnect();
  
    try {
      const { username, password } = await request.json();
  
      // Check if user exists
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      // Verify password
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if(password =  user.password)
  
      if (password !=  user.password) {
         return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        "123456",
        { expiresIn: "1h" }
      );

      
  
      return NextResponse.json(
        { message: "Sign-in successful", token },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during sign-in", error);
      return NextResponse.json(
        { message: "An error occurred during sign-in" },
        { status: 500 }
      );
    }
  }
  