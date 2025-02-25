'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";


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

  return (
    <div onClick={()=>{router.push(`/blogs/${blog._id}`)}} className='border border-gray-200 w-1/5 rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer hover:border-gray-400 transition-all duration-300 ease-in-out'>
        <img  src={blog.CoverImage}/>

        <div className='p-3'>
            <h1 className='text-[15px] font-bold  '>{blog.BlogTitle}</h1>
            <div className='flex gap-10 mt-1 items-center'>
            <p className='text-[10px]  font-bold text-slate-600'>{blog.AuthorName}</p>
            <p className='text-[10px] font-semibold '>{blog.PublishedDate}</p>
            </div>

            <div className='mt-5 flex items-center gap-2'>
              <Image  alt='star-icon' className='' src="/images/love.svg" width="15" height="15" /> 
              <p className='text-sm'>
              { blog.Rating.noOfLikes}

              </p>
                 
            </div>
        </div>
    </div>
  )
}

export default BlogBox
