'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const HeaderComponent = () => {

  const router = useRouter();


  return (
    <div className='bg-[#fdf6e3] px-10 py-5  font-bold flex flex-row items-center gap-96 ' >
      <h1 className='text-[#1A365D] text-2xl'>  
        BOOK-SHELF 
        </h1>
        
        <div className='flex  gap-16 '>
        <p onClick={()=>{router.push("/home")}} className='cursor-pointer'  >Home</p>
        <p  onClick={()=>{router.push("/blogs ")}} className='cursor-pointer'>Blogs</p>
        <p onClick={()=>{router.push("/user/library/i")}} className='cursor-pointer'> My Library</p>
        <p  onClick={()=>{router.push("/user/account")}} className='cursor-pointer'> Account </p>
        </div>
    </div>
  )
}

export default HeaderComponent
