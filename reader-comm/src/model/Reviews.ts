import mongoose, { Document, Schema } from "mongoose";

export interface BaseReview extends Document {
  // bookId: string;
  contentType:string,
  userId: string;
  reviewText: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookReview extends BaseReview {
  bookId: mongoose.Types.ObjectId | string;
  type: "book";
}

interface BlogReview extends BaseReview {
  blogId: mongoose.Types.ObjectId | string;
  type: "blog";
}

type Review = BookReview | BlogReview;

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: function(this: any) {
      return this.type === "book";
  }
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: function(this: any) {
      return this.type === "blog";
  }
  },
  contentType:{
    type:String,
    enum:['Book', 'Blog'],
    required:true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for unique reviews per user per book
reviewSchema.index({ refType: 1, refId: 1 }, { unique: true });

const ReviewModel =
  (mongoose.models.Review as mongoose.Model<Review>) ||
  mongoose.model<Review>("Review", reviewSchema);
export default ReviewModel;
