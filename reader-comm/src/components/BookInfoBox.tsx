'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

  return (
    <div className="w-72 p-5 pb-2 hover:cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border- bg-[hsl(48,29%,97%)]">
      <div onClick={()=>{router.push(`/book/${book._id}`)}}>
      <div className="overflow-hidden rounded-lg mb-4">
        <img
          src={book.BookCoverImage}
          alt="Book Cover"
          className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h2 className="font-serif text-lg font-medium text-gray-800 mb-4 line-clamp-2">
        {book.BookName}
      </h2>

      <div className='flex gap-5 items-center -mt-4'>
      <h2 className='text-gray-600 text-sm ' > {book.AuthorName}</h2> 
      <span className='text-xs text-[#6b6370] mt-1 ' >{book.PublishedDate}</span>
      </div>

      <div className='flex gap-5 items-center '>
      <div className='flex gap-2 my-5'>
      {Array.from({ length: Math.round(book.Rating.average) }, (_, index) => (  
        <Image key={index} alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
      ))}
        {/* <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
        <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
        <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" /> */}
        {/* <span className=''>4 / 5</span> */}
      </div>
      <p> . </p>
      <p className='text-sm text-[#6b6370] '>{book.category  } </p>
      </div>
      </div>
      <button onClick={()=>{handleAddToWishlist()}} className="w-full mt-3 group flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-300 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-300">
        <span className="font-medium">Add to Reading List</span>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default BookInfoBox;