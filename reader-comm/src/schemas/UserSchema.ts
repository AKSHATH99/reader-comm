 import { z } from "zod";

// Zod schema for BookList
export const BookListSchema = z.object({
  BookID: z.string().nonempty("BookID is required"),
  BookName: z.string().nonempty("BookName is required"),
  createdAt: z.date(),
});


// Zod schema for User
export const UserSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  noOFBookRead: z.number().optional(),
  noOfContributions: z.number().optional(),
  streakPoints: z.number().optional(),
  ReadBookList: z.array(BookListSchema).optional(),
  BookWishlist: z.array(BookListSchema).optional(),
});
