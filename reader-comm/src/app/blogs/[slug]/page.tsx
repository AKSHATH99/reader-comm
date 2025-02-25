'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface BlogRating {
  noOfLikes: number;
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

type ApiResponse = Blog | null;

const BlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug: any = params.slug;
  const blogID = decodeURIComponent(slug);
  
  const [blogData, setBlogData] = useState<ApiResponse>(null);

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
    }
  };

  useEffect(() => {
    FetchBlogDetails();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {blogData ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">{blogData.BlogTitle}</h1>
          <p className="text-gray-600 text-sm">By {blogData.AuthorName} - {new Date(blogData.PublishedDate).toDateString()}</p>
          <img
            src={blogData.CoverImage}
            alt={blogData.BlogTitle}
            className="w-full h-64 object-cover my-4 rounded-lg"
          />
          <p className="text-lg text-gray-800 mb-4">{blogData.content}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 text-sm">Category: {blogData.category}</span>
            <span className="text-gray-700 text-sm">Likes: {blogData.Rating.noOfLikes}</span>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BlogPage;
