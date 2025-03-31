import { razorpay } from "@/lib/Razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, currency = "INR" } = await req.json();
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({      
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
