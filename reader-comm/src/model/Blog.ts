import mongoose, { Document, Schema, Types } from "mongoose";

export interface Blogs extends Document {
  BlogTitle: string;
  AuthorID: Types.ObjectId;
  AuthorName:string
  PublishedDate: Date;
  CoverImage?: string;
  category: string;
  content: string;
  Rating: { noOfLikes: number; noOFReviews?: number };
}

const BlogSchema: Schema<Blogs> = new mongoose.Schema({
  BlogTitle: {
    type: String,
    required: true,
    unique: true,
  },
  AuthorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  AuthorName: {
    type:String,
    required: true,
    index: true,
  },
  PublishedDate: {
    type: Date,
    required: true,
  },
  CoverImage: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  Rating: {
    noOfLikes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
});

const BlogModel =
  (mongoose.models.Blog as mongoose.Model<Blogs>) ||
  mongoose.model<Blogs>("Blog", BlogSchema);

export default BlogModel;
