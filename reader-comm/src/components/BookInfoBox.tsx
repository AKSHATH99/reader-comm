'use client'

import React from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image"

const BookInfoBox = ({book}:any) => {
  console.log(typeof book.rating);
  
  const router = useRouter()
  

  return (
    <div onClick={()=>{router.push(`/book/${book.title}`)}} className="w-72 p-5 pb-2 hover:cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border- bg-[hsl(48,29%,97%)]">
      <div className="overflow-hidden rounded-lg mb-4">
        <img
          src={book.cover_image}
          alt="Book Cover"
          className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h2 className="font-serif text-lg font-medium text-gray-800 mb-4 line-clamp-2">
        {book.title}
      </h2>

      <div className='flex gap-5 items-center -mt-4'>
      <h2 className='text-gray-600 text-sm ' > {book.author}</h2> 
      <span className='text-xs text-[#6b6370] mt-1 ' >{book.published_year}</span>
      </div>

      <div className='flex gap-5 items-center '>
      <div className='flex gap-2 my-5'>
      {Array.from({ length: book.rating }, (_, index) => (  
    <Image key={index} alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
  ))}
        {/* <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
        <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" />
        <Image alt='star-icon' className='' src="/images/star-rating.png" width="15" height="15" /> */}
        {/* <span className=''>4 / 5</span> */}
      </div>
      <p> . </p>
      <p className='text-sm text-[#6b6370] '>{book.genre  } </p>
      </div>
      
      <button className="w-full mt-3 group flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-300 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-300">
        <span className="font-medium">Add to Reading List</span>
      </button>
    </div>
  );
};

export default BookInfoBox;