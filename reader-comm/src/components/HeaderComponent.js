import React from 'react'

const HeaderComponent = () => {
  return (
    <div className='bg-[#fdf6e3] px-10 py-5  font-bold flex flex-row items-center gap-96 ' >
      <h1 className='text-[#1A365D] text-2xl'>  
        BOOK-SHELF 
        </h1>
        
        <div className='flex  gap-16 '>
        <p>Home</p>
        <p>Blogs</p>
        <p> My Wishlist</p>
        <p> Account </p>
        </div>
    </div>
  )
}

export default HeaderComponent
