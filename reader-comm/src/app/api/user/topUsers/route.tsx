import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import UserModel from '@/model/User';

export async function GET() {
  try {
    await dbConnect();

    // Fetch users sorted by noOFBookRead in descending order
    const topUsers = await UserModel.find({})
      .select('username noOFBookRead') // Only select required fields
      .sort({ noOFBookRead: -1 }) // Sort in descending order
      .limit(10); // Limit to top 10 users

    return NextResponse.json({
      success: true,
      users: topUsers
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch top users'
    }, { status: 500 });
  }
}