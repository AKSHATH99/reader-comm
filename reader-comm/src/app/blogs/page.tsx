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
      <h1 className="text-4xl">BLOGS</h1>
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
