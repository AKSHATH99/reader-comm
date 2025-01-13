import mongoose, { Document, Schema } from "mongoose";

export interface Reviews extends Document {
        bookId:string,
        userId: string,
        reviewText: string,
        rating: number,
        createdAt: Date,
        updatedAt:Date

}

const reviewSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true 
    },
    reviewText: {
      type: String,
      required: true
    },
    rating:{
        type:Number,
        required:true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
  });
  
  // Compound index for unique reviews per user per book
  reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });
  
  const ReviewModel = (mongoose.models.Review as mongoose.Model<Reviews>) || mongoose.model<Reviews>('Review', reviewSchema);
  export default ReviewModel;