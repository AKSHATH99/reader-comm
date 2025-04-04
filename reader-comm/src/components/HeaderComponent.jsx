'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const HeaderComponent = () => {

  const router = useRouter();
  const [loggedIn , setLoggedIn] = useState(true);

  useEffect(()=>{
    const ifLoggedIn = localStorage.getItem('userId')

        if (!ifLoggedIn) {
            setLoggedIn(false)
        }
  },[router])

  return (
    <div className='px-10 py-5  font-bold flex flex-row items-center gap-96 bg-gray-100' >
      <h1 onClick={()=>{router.push("/")}} className='text-[#1A365D] text-2xl hover:text-[#14b8a6] cursor-pointer'>  
        BOOK-SHELF 
        </h1>
        
        <div className='flex  gap-16 '>
        <p onClick={()=>{router.push("/home")}} className='cursor-pointer hover:text-[#14b8a6]'  >Books</p>
        <p  onClick={()=>{router.push("/blogs ")}} className='cursor-pointer hover:text-[#14b8a6]'>Blogs</p>
        <p onClick={()=>{router.push("/user/library/i")}} className='cursor-pointer hover:text-[#14b8a6]'> My Library</p>
        {loggedIn && router.pathname != "/" && (
          <p onClick={()=>{router.push("/cart")}} className='cursor-pointer hover:text-[#14b8a6]'> Cart </p>
        )}
        <p  onClick={()=>{router.push("/user/account")}} className='cursor-pointer hover:text-[#14b8a6] '> Account </p>
        </div>
    </div>
  )
}

export default HeaderComponent
