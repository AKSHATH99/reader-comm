import React from 'react'

const SearchBox = () => {
  return (
    <div className=' w-1/2  flex'>
      <input placeholder='Search for your book here' type='text' className=' border rounded-l-xl w-3/4 h-10 p-3 flex items-center justify-center ' />
      <button className=' border  rounded-r-xl h-10 p-3'>Search</button>
    </div>  
  )
}

export default SearchBox
