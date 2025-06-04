import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/Cloudinary";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { Types } from "mongoose";
import BlogModel from "@/model/Blog";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();


    const BlogCoverImage = formData.get("CoverImage") as File;

    // Extract other form fields
    const BlogTitle = formData.get("BlogTitle") as string;
    const AuthorName = formData.get("AuthorName") as string;
    const PublishDate = formData.get("PublishDate") as string;
    const BlogContent = formData.get("BlogContent") as string;
    const category = formData.get("category") as string;
    const userId = formData.get("AuthorID") as string;

    // console.log(BlogTitle,AuthorName,PublishDate,BlogContent,category,userId);

    // Check if user exists
    const query = {
      $or: [
        { _id: userId ? new Types.ObjectId(userId) : null }, // Search by ID
        { username: AuthorName || null }, // Search by BlogTitle
      ].filter((condition) => {
        return Object.values(condition).every((value) => value !== null);
      }),
    };
    console.log(userId)
    const VerifyUser = await UserModel.findById(userId);

    if (!VerifyUser) {
      return NextResponse.json(
        { message: "User not found , login to add blog" },
        { status: 400 }
      );
    }

    // Upload  cover image
    const BlogCoverBuffer = await BlogCoverImage.arrayBuffer();
    const blogCoverUploaded: any = await uploadOnCloudinary(
      BlogCoverBuffer,
      BlogCoverImage.name
    );

    // console.log("Blog Cover Image URL:", blogCoverUploaded.url);

    if (!blogCoverUploaded.url) {
      return NextResponse.json(
        { message: "File upload failed" },
        { status: 500 }
      );
    }

    // Create the blog entry
    const newBlog = new BlogModel({
      BlogTitle,
      AuthorName,
      AuthorID:userId,
      PublishedDate: PublishDate,
      CoverImage: blogCoverUploaded.url,
      content:BlogContent,
      category,
    });

    const addedBlog = await newBlog.save();

    if (addedBlog) {
      return NextResponse.json(
        { message: "Blog has been successfully uploaded" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error while adding Blog :", error);
    return NextResponse.json(
      { message: "Error while adding Blog" },
      { status: 500 }
    );
  }
}
