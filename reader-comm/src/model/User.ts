import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface BookList extends Document {
    BookID: string,
    BookName: string;
    createdAt: Date;
  }

  const BookListSchema: Schema<BookList> = new mongoose.Schema({
    BookID:{
        type:String,
        required:true,
    },
    BookName:{
        type:String,
        required:true ,     
    },
    createdAt:{
        type:Date,
        required : true
    }


}) 

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  noOFBookRead?: number;
  noOfContributions?: number;
  streakPoints?: number;
  ReadBookList?: BookList[];
  BookWishlist?: BookList[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
    username : {
        type:String,
        unique:true,
        required:[true,'Username is required'],

    },
    email : {
        type:String,
        unique:true,
        required:[true,'email is required'],

    },
    
    password : {
        type:String,
        required:[true,'password is required'],

    },
    noOFBookRead:{
        type:Number,
    },

    noOfContributions:{
        type:Number,
    },
    streakPoints:{
        type:Number,
    },
    ReadBookList: {
        type: [BookListSchema],
        default: [],
    },
    BookWishlist: {
        type: [BookListSchema],
        default: [],
    },


},{ timestamps: true });

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

  export default UserModel;