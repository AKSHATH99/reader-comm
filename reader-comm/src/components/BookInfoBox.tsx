'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDate } from '@/helpers/FormatDate';
interface Book {
  _id: string;
  BookName: string;
  AuthorName: string;
  BookCoverImage: string;
  category: string;
  Rating: {
    average: number;
    noOFReviews: number;
  };
  PublishedDate: string;
  price: number;
  stock: number;
}

interface BookInfoBoxProps {
  book: Book;
}

const BookInfoBox = ({ book }: BookInfoBoxProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddToWishlist = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/user/addWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bookId: book._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      // Show success message or update UI
      alert('Book added to wishlist successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/user/addToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bookId: book._id,
          count: 1,
          bookName: book.BookName,
          bookImage: book.BookCoverImage,
          price: book.price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      // Show success message or update UI
      alert('Book added to cart successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-72 bg-[hsl(48,29%,97%)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
  <div 
    className="cursor-pointer" 
    onClick={() => {router.push(`/book/${book._id}`)}}
  >
    {/* Cover Image */}
    <div className="h-64 overflow-hidden">
      <img
        src={book.BookCoverImage}
        alt="Book Cover"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
    
    {/* Book Info Section */}
    <div className="p-4">
      {/* Title */}
      <h2 className="font-serif text-lg font-medium text-gray-800 mb-2 line-clamp-2">
        {book.BookName}
      </h2>
      
      {/* Author & Date */}
      <div className="flex items-center justify-between text-gray-600 mb-3">
        <span className="text-sm">{book.AuthorName}</span>
        <span className="text-xs text-[#6b6370]">{formatDate(book.PublishedDate)}</span>
      </div>
      
      {/* Rating & Category */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex">
          {Array.from({ length: Math.round(book.Rating.average) }, (_, index) => (
            <Image 
              key={index} 
              alt="star-icon" 
              src="/images/star-rating.png" 
              width="15" 
              height="15" 
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">•</span>
        <p className="text-xs text-[#6b6370]">{book.category}</p>
      </div>
    </div>
  </div>
  
  {/* Button Section */}
  <div className="px-4 pb-4">
    <button 
      onClick={() => {handleAddToWishlist()}} 
      className="w-full bg-themeColor text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
    >
      <span>Add to Reading List</span>
    </button>
   {book?.stock>0 ? <button 
      onClick={()=>{handleAddToCart()}} 
      className="w-full mt-2 bg-gray-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
    >
      <span>Add to Cart {book?.price && <span className="ml-2"> &#8377;{book?.price}</span>}</span>
    </button>:<p className="mt-5 text-xs text-gray-500 text-center">Currently Out of Stock</p>}
    
    {error && (
      <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
    )}
  </div>
</div>
  );
};

export default BookInfoBox;