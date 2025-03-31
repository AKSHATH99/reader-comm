import mongoose, { Document, Schema } from "mongoose";

export interface Books extends Document {
  // BookID: string;
  BookName: string;
  AuthorName: string;
  PublishedDate: Date;
  CurrentVersionPublishDate: Date;
  BookCoverImage: string;
  totalPages: string;
  BookPDFLink: string;
  category: string;
  Rating: {average: number, noOFReviews?: number, totalRating?: number};
  Links: {storeName: string, url: string}[]; 
  BookDescription: string;
  stock: number;
  available: boolean;
}

const BooksSchema: Schema<Books> = new mongoose.Schema({
  // BookID: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
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
      // required: true,
      default:0,
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
  BookDescription: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const BookModel =
  (mongoose.models.Book as mongoose.Model<Books>) ||
  mongoose.model<Books>("Book", BooksSchema);

export default BookModel;
