import mongoose, { Document, Schema } from "mongoose";

export interface Orders extends Document {
  amount: number;
  currency: string;
  userId: string;
  bookId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  price: number;
}


const OrdersSchema: Schema<Orders> = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },    
  razorpayOrderId: {    
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },    
  razorpaySignature: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderModel = (mongoose.models.Order as mongoose.Model<Orders>) || mongoose.model<Orders>("Order", OrdersSchema);

export default OrderModel;


