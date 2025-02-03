import React from 'react'
import Blogbox from "../../components/BlogsBox.jsx"

const Blogs = () => {



  return (
    <div className=' p-10 '>
        <h1 className='text-4xl'>BLOGS</h1>
      <p className='mt-3 text-gray-500'>
        Browse through blogs and read experiences of other users and find your next taste 
        </p>

        <div className='p-10 flex flex-wrap  gap-10 '>
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
           <Blogbox/> 
        </div>
    </div>
  )
}

export default Blogs
