'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookInfoBox from '@/components/BookInfoBox';
import { FaTrash } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Book {
  _id: string;
  BookName: string;
  AuthorName: string;
  BookCoverImage: string;
  category: string;
}

const Library = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          router.push('/auth/signin');
          return;
        }

        // Fetch user data
        // const userResponse = await fetch(`/api/user/${userId}`, {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   }
        // });

        // if (!userResponse.ok) {
        //   throw new Error('Failed to fetch user data');
        // }

        // const userData = await userResponse.json();
        // setUser(userData);

        // Fetch read books
        const readBooksResponse = await fetch('/api/user/getReadList', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        });
        
        if (readBooksResponse.ok) {
          const readBooksData = await readBooksResponse.json();
          setReadBooks(readBooksData.readBooks || []);
        }

        // Fetch wishlist
        const wishlistResponse = await fetch('/api/user/getWishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        });
        
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(wishlistData.wishlist || []);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);
  
  const handleReadBook = async (bookId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please sign in to mark books as read');
        return;
      }
      console.log( "executing this ",userId, bookId);
      const addToReadResponse = await fetch('/api/user/TransferList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bookId
        })
      });
      console.log( "response transfer list ",addToReadResponse);
      if (!addToReadResponse.ok) {
        throw new Error('Failed to add book to read list');
      }
      window.location.reload();
      alert('Book marked as read successfully!');
    } catch (error) {
      console.error('Error updating book status:', error);
      alert('Failed to update book status');
    }
  };

  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out your favourite books and books you have saved over here
          </p>
        </div>
  
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
              <div className="text-red-600 text-center font-medium text-lg">{error}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Wishlist Section */}
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center mb-8 border-b pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
              </div>
              
              {wishlist.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">No books in wishlist</p>
                  <p className="text-gray-400 mt-2">Books you want to read will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {wishlist.map((book) => (
                    <div key={book._id} className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden">
                      <Link href={`/book/${book._id}`}>
                        <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg">
                          <img
                            src={book.BookCoverImage}
                            alt={book.BookName}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="px-3 pb-4">
                          <h3 className="font-semibold text-lg truncate text-gray-900">{book.BookName}</h3>
                          <p className="text-gray-600 text-sm mb-2">{book.AuthorName}</p>
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {book.category}
                          </span>
                        </div>
                      </Link>
                      <div className="px-3 pb-3">
                        <button 
                          onClick={() => handleReadBook(book._id)} 
                          className="w-full bg-[#14b8a6] text-white px-4 py-2 rounded-lg hover:bg-[#0e9384] transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Completed Reading
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
  
            {/* Read Books Section */}
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center mb-8 border-b pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Books I've Read</h2>
              </div>
              
              {readBooks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 text-lg">No books read yet</p>
                  <p className="text-gray-400 mt-2">Books you've completed will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {readBooks.map((book) => (
                    <Link href={`/book/${book._id}`} key={book._id}>
                      <div className="group cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden">
                        <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg">
                          <img
                            src={book.BookCoverImage}
                            alt={book.BookName}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="px-3 pb-4">
                          <h3 className="font-semibold text-lg truncate text-gray-900">{book.BookName}</h3>
                          <p className="text-gray-600 text-sm mb-2">{book.AuthorName}</p>
                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {book.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library
