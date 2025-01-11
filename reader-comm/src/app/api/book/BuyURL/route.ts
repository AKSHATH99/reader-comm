import dbConnect from "@/lib/dbConnect";
import BookModel from "@/model/Books";
import { NextResponse } from "next/server";


export async function  POST(request : Request){
    await dbConnect();

    try {
        // const { "" } = await request.json(); // Extract book ID from the route parameter
        const { storeName, url , bookId } = await  request.json();

        console.log(bookId)

        if(!bookId){
            return NextResponse.json(
                { message: "Book not found" },
                { status: 404 }
              )
        }

        if(!storeName || !url){
            return NextResponse.json(
                { message: "No data recieved to update " },
                { status: 200 }
              )
        }

        const book = await BookModel.findById(bookId);
        const isDuplicate = book?.Links.some((link) => link?.url === url);

        if (isDuplicate) {
          return NextResponse.json(
            { message: "The following link already exists" },
            { status: 400 }
          );
        }



        const updateDetails = await BookModel.findByIdAndUpdate(bookId,
            {
                $push:{
                    Links:{ storeName , url}
                }
            },
            {new:true}
        )
       
        return NextResponse.json(
                { message: "Links are added successfully " },
                { status: 200 }
              )
        
    } catch (error) {
        console.log(error, "Error while adding book link details");
    return NextResponse.json(
      { message: "Error while adding book link details" },
      { status: 500 }
    );
    }
}
