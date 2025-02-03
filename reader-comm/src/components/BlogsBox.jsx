'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";


const BlogsBox = () => {
    
    const router = useRouter()

  return (
    <div onClick={()=>{router.push("/blogs/i")}} className='border border-gray-200 w-1/5 rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer hover:border-gray-400 transition-all duration-300 ease-in-out'>
        <img  src='/images/blog-image.jpg'/>

        <div className='p-3'>
            <h1 className='text-[15px] font-bold  '> 10 books you should read in 2025</h1>
            <div className='flex gap-10 mt-1 items-center'>
            <p className='text-[10px]  font-bold text-slate-600'>By Anirudh Ravichandar</p>
            <p className='text-[10px] font-semibold '>2025-01-12</p>
            </div>

            <div className='mt-5 flex items-center gap-2'>
                 {Array.from({ length: 5 }, (_, index) => (  
                    <Image key={index} alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
                  ))}
            </div>
        </div>
    </div>
  )
}

export default BlogsBox
