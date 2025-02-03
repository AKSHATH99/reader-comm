'use client'

import React from 'react';
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

const BookPage = () => {
  const router = useRouter()
  const params = useParams()

  const slug:any = params.slug ;
  const bookname = decodeURIComponent(slug)
  console.log(bookname);
  

  return (
    <div >
      Book detials bro  
    </div>
  );
};

export default BookPage;