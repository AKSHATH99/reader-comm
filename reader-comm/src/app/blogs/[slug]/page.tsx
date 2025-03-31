'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaStar, FaRegStar, FaTrash, FaEdit } from 'react-icons/fa'

interface BlogRating {
  noOfLikes: number;
  noOFReviews?: number;
}

interface Blog {
  Rating: BlogRating;
  _id: string;
  BlogTitle: string;
  AuthorID: string;
  AuthorName: string;
  PublishedDate: string;
  CoverImage: string;
  content: string;
  category: string;
  __v: number;
}

interface Review {
  _id: string;
  blogId: string;
  userId: string;
  reviewText: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type ApiResponse = Blog | null;

const BlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug: any = params.slug;
  const blogID = decodeURIComponent(slug);
  
  const [blogData, setBlogData] = useState<ApiResponse>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const FetchBlogDetails = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/blogs/${blogID}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlogData(response.data);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch blog details');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/review/BlogReviews/${blogID}`);
      if (response.data.blogReviews) {
        setReviews(response.data.blogReviews);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchBlogDetails();
    fetchReviews();
  }, [blogID]);

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
      const response = await axios.post(`/api/review/addBlogReview/${blogID}`, {
        userId,
        reviewText: newReview.reviewText,
        rating: newReview.rating
      });

      if (response.status === 201) {
        setNewReview({ rating: 0, reviewText: '' });
        fetchReviews();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.post(`/api/review/deleteBlogReviews/${blogID}`, {
        userID: userId
      });
      fetchReviews();
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    try {
      await axios.post(`/api/review/updateBlogReview/${blogID}`, {
        userId,
        reviewText: newReview.reviewText,
        rating: newReview.rating
      });
      setEditingReview(null);
      setNewReview({ rating: 0, reviewText: '' });
      fetchReviews();
    } catch (error) {
      setError('Failed to update review');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {blogData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">{blogData.BlogTitle}</h1>
          <p className="text-gray-600 text-sm">By {blogData.AuthorName} - {new Date(blogData.PublishedDate).toDateString()}</p>
          <img
            src={blogData.CoverImage}
            alt={blogData.BlogTitle}
            className="w-full h-64 object-cover my-4 rounded-lg"
          />
          <p className="text-lg text-gray-800 mb-4">{blogData.content}</p>
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-700 text-sm">Category: {blogData.category}</span>
            <span className="text-gray-700 text-sm">Likes: {blogData.Rating.noOfLikes}</span>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400">
                            {star <= review.rating ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-800">{review.reviewText}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
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
          </div>
        </motion.div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
