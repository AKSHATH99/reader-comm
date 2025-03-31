'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

export default function Home() {
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
        const userResponse = await fetch(`/api/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);

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

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {user ? (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-bold mb-8">Account Details</h1>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <label className="text-sm text-gray-600">Username</label>
                <p className="text-lg font-medium">{user.username}</p>
              </div>
              
              <div className="border-b pb-4">
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Read Books Section */}
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Books I've Read</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {readBooks.map((book) => (
                <Link href={`/book/${book._id}`} key={book._id}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] mb-2 overflow-hidden rounded-lg">
                      <img
                        src={book.BookCoverImage}
                        alt={book.BookName}
                        // fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-lg truncate">{book.BookName}</h3>
                    <p className="text-gray-600 text-sm">{book.AuthorName}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {book.category}
                    </span>
                  </div>
                </Link>
              ))}
              {readBooks.length === 0 && (
                <p className="text-gray-500 col-span-full text-center">No books read yet</p>
              )}
            </div>
          </div>

          {/* Wishlist Section */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((book) => (
                <Link href={`/book/${book._id}`} key={book._id}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[2/3] mb-2 overflow-hidden rounded-lg">
                      <img
                        src={book.BookCoverImage}
                        alt={book.BookName}
                        // fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-lg truncate">{book.BookName}</h3>
                    <p className="text-gray-600 text-sm">{book.AuthorName}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {book.category}
                    </span>
                  </div>
                </Link>
              ))}
              {wishlist.length === 0 && (
                <p className="text-gray-500 col-span-full text-center">No books in wishlist</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xl text-center">No user data found</div>
      )}
    </div>
  );
}
