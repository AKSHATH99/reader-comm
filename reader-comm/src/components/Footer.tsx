import React from 'react'
const Footer = () => {
  return (
    <div className="bg-gray-100 px-5 py-5 w-full font-bold flex flex-row items-center justify-between">
      <h1 className="text-[#1A365D] text-xl">
        BOOK-SHELF <span className="text-sm">© 2024</span>
      </h1>
      
      <div className="flex gap-16">
        <p>Work with Us</p>
        <p>About Us</p>
        <p>Blogs</p>
        <p>Terms & Conditions</p>
      </div>
    </div>
  );
};



export default Footer
