import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import BookModel from '@/model/Books';
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in by verifying token
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get book ID from request body
    const { bookId } = await request.json();
    console.log("Book ID:", bookId);

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find book and check stock
    const book = await BookModel.findById(bookId);

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (!book.available || book.stock < 1) {
      return NextResponse.json(
        { error: 'Book is out of stock' },
        { status: 400 }
      );
    }

    // Reduce stock by 1
    book.stock -= 1;
    if (book.stock === 0) {
      book.available = false;
    }
    await book.save();

    return NextResponse.json(
      { 
        message: 'Book purchased successfully',
        remainingStock: book.stock
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in book purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
