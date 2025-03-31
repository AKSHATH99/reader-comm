"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar, FaCalendar, FaUser, FaBook, FaBookmark, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import BookInfoBox from "@/components/BookInfoBox";

const BookPage = () => {
  interface Book {
    _id: string;
    BookCoverImage: string;
    BookName: string;
    Rating: {
      average: number;
      noOFReviews: number;
    };
    AuthorName: string;
    PublishedDate: string;
    category: string;
  }

  interface BookReview {
    _id: string;
    bookId: string;
    contentType: string;
    userId: string;
    reviewText: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface Rating {
    average: number;
    noOFReviews: number;
    totalRating: number;
  }

  interface BookRatings {
    Rating: Rating;
    _id: string;
  }

  interface ApiResponse {
    message: string;
    bookRatings: BookRatings;
    bookReviews: BookReview[];
  }

  const router = useRouter();
  const params = useParams();

  const slug: any = params.slug;
  const bookid = decodeURIComponent(slug);

  const [book, setBook] = useState<Book | null>(null);
  const [reviewdata, setReviewData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: '' });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const FetchBookDetails = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/book/${bookid}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      setBook(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const FetchRelatedBooks = async () => {
    try {
      const category = book?.category;
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/book/BookbyCategory/${category}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setRelatedBooks(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    FetchRelatedBooks();
  }, [book]);


  const FetchReviews = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/review/BookReviews/${bookid}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      setReviewData(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([FetchBookDetails(), FetchReviews()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(book);
  }, [book]);

  useEffect(() => {
    console.log(reviewdata);
  }, [reviewdata]);

  const handleRatingClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('Please sign in to add a review');
      return;
    }

    try {
      const response = await axios.post(`/api/review/addBookReview/${bookid}`, {
        userId,
        reviewText: newReview.reviewText,
        rating: newReview.rating
      });

      if (response.status === 200) {
        setNewReview({ rating: 0, reviewText: '' });
        FetchReviews();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.post(`/api/review/deleteReview/${bookid}`, {
        userID: userId
      });
      FetchReviews();
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    try {
      await axios.post(`/api/review/updateReview/${bookid}`, {
        userId,
        reviewText: newReview.reviewText,
        rating: newReview.rating
      });
      setEditingReview(null);
      setNewReview({ rating: 0, reviewText: '' });
      FetchReviews();
    } catch (error) {
      setError('Failed to update review');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setIsWishlistLoading(true);
      setError('');
      
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
          bookId: bookid
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      alert('Book added to wishlist successfully!');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {book ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Book Header Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/3 p-6"
              >
                <img
                  src={book.BookCoverImage}
                  alt={book.BookName}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
              <div className="md:w-2/3 p-6">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  {book.BookName}
                </motion.h1>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaUser className="mr-2" />
                    <span>{book.AuthorName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendar className="mr-2" />
                    <span>{book.PublishedDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBook className="mr-2" />
                    <span>{book.category}</span>
                  </div>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    {/* <span className="text-gray-700">
                      {reviewdata?.bookRatings.Rating.average.toFixed(1)} ({reviewdata?.bookRatings.Rating.noOFReviews} reviews)
                    </span> */}
                  </div>
                  <button 
                    onClick={handleAddToWishlist}
                    disabled={isWishlistLoading}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {isWishlistLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FaBookmark className="mr-2" />
                    )}
                    Add to Reading List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            
            {/* Add Review Form */}
            {userId && (
              <form onSubmit={handleSubmitReview} className="mb-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= newReview.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviewdata?.bookReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            } mr-1`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.reviewText}</p>
                      <span className="text-gray-500 text-sm mt-2 block">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {userId === review.userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingReview(review._id);
                            setNewReview({ rating: review.rating, reviewText: review.reviewText });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>


            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </motion.div>
          
          <div className="mt-4">
              You might also like
              <div className="flex flex-wrap gap-4">
              {relatedBooks
                .filter(relatedBook => relatedBook.BookName !== book?.BookName)
                .map((relatedBook) => (
                  <BookInfoBox key={relatedBook.BookName} book={relatedBook} />
              ))}
              </div>
            </div>
        </motion.div>
      ) : (
        <div className="text-center text-gray-600">Book not found</div>
      )}
    </div>
  );
};

export default BookPage;
