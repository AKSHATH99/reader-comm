import mongoose, { Document, Schema } from "mongoose";

export interface Books extends Document {
  BookID: string;
  BookName: string;
  AuthorName: string;
  PublishedDate: Date;
  CurrentVersionPublishDate: Date;
  BookCoverImage: string;
  totalPages: string;
  BookPDFLink: string;
  category: string;
  Reviews: [
    userId: number,
    reviewText: string,
    rating: number,
    createdAt: Date
  ];
  Rating: [average: number, noOFReviews: number, totalRating: number];
  Links: [storeName: string, url: string]; 
}

const BooksSchema: Schema<Books> = new mongoose.Schema({
  BookID: {
    type: String,
    required: true,
    unique: true,
  },
  BookName: {
    type: String,
    required: true,
    unique: true,
  },
  AuthorName: {
    type: String,
    required: true,
  },
  PublishedDate: {
    type: Date,
    required: true,
  },
  CurrentVersionPublishDate: {
    type: Date,
    // required: true,
  },
  BookCoverImage: {
    type: String,
    required: true,
  },
  totalPages: {
    type: String,
    required: true,
  },
  BookPDFLink: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    required: true,
  },

  Rating: {
    average: {
      type: Number,
      required: true,
      default: 0,
    },
    noOFReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRating: {
      type: Number,
      required: true,
    },
  },
  Links: [
    {
      storeName: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  Reviews: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
    },
  ],
});

const BookModel =
  (mongoose.models.User as mongoose.Model<Books>) ||
  mongoose.model<Books>("User", BooksSchema);

export default BookModel;
