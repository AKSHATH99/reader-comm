import React from 'react'
const Footer = () => {
  return (
    <div className="bg-[#fdf6e3] px-5 py-5 bottom-0 w-full fixed font-bold flex flex-row items-center gap-96">
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
