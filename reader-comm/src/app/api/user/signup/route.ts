import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ApiError from "@/types/ApiError";
import ApiResponse from "@/types/ApiResponse";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUser = await UserModel.findOne({
      username,
    });

    if(existingUser){
      return NextResponse.json(
        { message: "User with these credentials already exists" },
        { status: 400 }
      );
    }


    //create new user
    const hashedPassword = await bcrypt.hash(password,10);
    // const expiryDate = new

    const newUser = new UserModel({
      username,
      password,
      email
    })

    await newUser.save();

    if(newUser){
      return NextResponse.json(
        { message: "Account creation successful" },
        { status: 200 }
      );  
    }
    


  } catch (error) {
    console.log(error, "Error regstring user , mail sending while");
    return NextResponse.json(
      { message: "Some error occurred while signing up" },
      { status: 500 }
    );
    
  }
}

