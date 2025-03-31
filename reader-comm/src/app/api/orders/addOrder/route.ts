import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Orders";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const orderData = await req.json();
    console.log("orderData in api ahahahah",orderData);

    const order = new OrderModel({
      amount: orderData.amount,
      currency: orderData.currency,
      userId: orderData.userId,
      bookId: orderData.bookId,
      status: orderData.status,
      createdAt: new Date(),
      razorpayOrderId: orderData.razorpayOrderId,
      razorpayPaymentId: orderData.razorpayPaymentId, 
      razorpaySignature: orderData.razorpaySignature,
      price: orderData.price
    });

    await order.save();

    return Response.json({
      success: true,
      message: "Order added successfully",
      order
    });

  } catch (error) {
    console.error("Error adding order:", error);
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to add order"
    }, { status: 500 });
  }
}
