'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { formatDate } from '../helpers/FormatDate';
import { motion } from 'framer-motion';

interface BlogboxProps {
  blog: {
    Rating: { noOfLikes: number };
    _id: string;
    BlogTitle: string;
    AuthorID: string;
    AuthorName: string;
    PublishedDate: string;
    CoverImage: string;
    content: string;
    category: string;
    __v: number;
  };
}


const BlogBox: React.FC<BlogboxProps> = ({ blog }) => {
    console.log("BLOGDATA >>" , blog.AuthorName);
    
    const router = useRouter()

    useEffect(()=>{
      console.log(formatDate(blog.PublishedDate));
    },[])

  return (
    <motion.div 
    onClick={() => {router.push(`/blogs/${blog._id}`)}}
    className='w-1/5 bg-[hsl(48,29%,97%)] cursor-pointer rounded-xl overflow-hidden shadow-sm border border-gray-100'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ 
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      borderColor: "#d1d5db"
    }}
  >
    {/* Cover Image */}
    <motion.div className="overflow-hidden">
      <motion.img  
        src={blog.CoverImage}
        alt="Blog Cover"
        className="w-full h-48 object-cover"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
    <motion.div 
      className='text-xs font-medium bg-blue-50 text-blue-700 py-1 px-3 rounded-full inline-block my-2'
      whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
    >
      {blog.category}
    </motion.div>
    {/* Content Section */}
    <div className='p-4 pt-0  '>
      {/* Title */}
      <motion.h1 
        className='text-lg font-serif font-bold text-black line-clamp-2 mb-2'
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
      >
        {blog.BlogTitle}
      </motion.h1>
      
      {/* Author & Date */}
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-medium text-gray-600'>{blog.AuthorName}</p>
        <p className='text-xs text-[#6b6370]'>{formatDate(blog.PublishedDate)}</p>
      </div>
      
      {/* Likes */}
      <motion.div 
        className='flex items-center gap-2 mt-2'
        whileHover={{ scale: 1.05, x: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Image 
          alt='like-icon' 
          src="/images/love.svg" 
          width="15" 
          height="15" 
        />
        <p className='text-xs text-gray-600'>
          {blog.Rating.noOfLikes} likes
        </p>
      </motion.div>
    </div>
  </motion.div>
  )
}

export default BlogBox
