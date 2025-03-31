"use client";

import React, { useEffect, useState } from "react";
import BlogBox from "@/components/BlogsBox";
import axios from "axios";

const Blogs = () => {
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

  type ApiResponse = Blog[];

  const [blogData, setBlogData] = useState<ApiResponse | null>(null);

  const fetchAllBooks = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse>(
        "http://localhost:3000/api/blogs/all",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);
  useEffect(() => {
    console.log(blogData);
  }, [blogData]);

  return (
    <div className=" p-10 ">
      <div className="flex justify-between items-center">
      <h1 className="text-4xl">BLOGS</h1>                     
      <a href="/blogs/addblog">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add your own blog
        </button>
      </a>  

      </div>
      <p className="mt-3 text-gray-500">
        Browse through blogs and read experiences of other users and find your
        next taste
      </p>
      {blogData ? (
        <div className="p-10 flex flex-wrap gap-10">
          {blogData.map((blog) => (
            <BlogBox key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <p>Loading blogs...</p>
      )}
    </div>
  );
};

export default Blogs;
