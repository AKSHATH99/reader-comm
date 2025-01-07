import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";


export async function  POST(request : Request){
    await dbConnect();

    try {
        const { bookId } = await request.json(); // Extract book ID from the route parameter
        const { storeName, url } =  request.body;

        if(!bookId){
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
              )
        }

        if(!storeName || !url){
            return NextResponse.json(
                { message: "No data recieved to update " },
                { status: 500 }
              )
        }


        const updateDetails = await BookModel.findByIdAndUpdate(bookId,
            {
                $push:{
                    Links:{ storeName , url}
                }
            },
            {new:true}
        )


        if(!updateDetails){
            return NextResponse.json(
                { message: "No data recieved to update " },
                { status: 500 }
              )
        }
    } catch (error) {
        console.log(error, "Error while adding book link details");
    return NextResponse.json(
      { message: "Error while adding book link details" },
      { status: 500 }
    );
    }
}
