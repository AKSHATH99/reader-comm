import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import BookModel from "@/model/Books";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/Cloudinary";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post('/addbook', async (req:any, res:any) => {
  await dbConnect();

  try {
    const {
      BookName,
      AuthorName,
      PublishDate,
      CurrentVersionPublishDate,
      BookCoverImage,
      totalPages,
      category,
      adminPassword,
    } = await req.json();

    //admin validation , only admin can use this
    const adminAuthenicationPassword = process.env.ADMIN_PASS;

    if (adminPassword != adminAuthenicationPassword) {
      return NextResponse.json(
        { message: "Not authorised to do this " },
        { status: 500 }
      );
    }



    const exisitingBook = await BookModel.findOne({
      BookName,
      AuthorName,
    });

    if (exisitingBook) {
      return NextResponse.json(
        { message: "Book already exist " },
        { status: 400 }
      );
    }

    //-------------------------- UPLOADING TO CLOUDINARY-------------

    const { bookcoverimage, bookpdf } = req.files;
    const bookCoverResult:any = await uploadOnCloudinary(bookcoverimage[0].buffer, bookcoverimage[0].originalname);
    const bookPdfResult:any = await uploadOnCloudinary(bookpdf[0].buffer, bookpdf[0].originalname);
    console.log("Book Cover Image uploaded to Cloudinary:", bookCoverResult.url);
    console.log("Book PDF uploaded to Cloudinary:", bookPdfResult.url);


  if (!bookCoverResult.url && !bookPdfResult.url) {
    return NextResponse.json(
      { message: "Photo upoad failed " },
      { status: 200 }
    );
  }

    const newBook = new BookModel({
      BookName,
      AuthorName,
      PublishDate,
      CurrentVersionPublishDate,
      BookCoverImage,
      totalPages,
      category,
    });

    const createdBook = await newBook.save();

    if (createdBook) {
      return NextResponse.json(
        { message: "Book has bee successfully uplaoded" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error, "Error while adding book details");
    return NextResponse.json(
      { message: "Error while adding book details" },
      { status: 500 }
    );
  }
})
