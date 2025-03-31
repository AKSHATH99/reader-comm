'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
  return (
    <div className=" mt-96 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1A365D]">
          Welcome to Book-Shelf
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your digital sanctuary for all things books - discover, share, and connect with fellow readers
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-[#1A365D]">Discover Books</h2>
            <p className="text-gray-600">Browse through our vast collection and find your next favorite read</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-[#1A365D]">Share Your Thoughts</h2>
            <p className="text-gray-600">Create and share blog posts about your reading experiences</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-[#1A365D]">Track Your Reading</h2>
            <p className="text-gray-600">Maintain your reading list and track your reading progress</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            className="px-8 py-3 bg-[#1A365D] text-white rounded-lg hover:bg-blue-800 transition-colors"
            onClick={() => {router.push("/home")}}
          >
            Start Exploring
          </button>
          <button 
            className="px-8 py-3 border-2 border-[#1A365D] text-[#1A365D] rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {router.push("/blogs")}}
          >
            Read Blogs
          </button>
        </div>

        <div className="mt-12 relative w-full max-w-4xl h-64">
          <Image
            src="/books-hero.jpg"
            alt="Books collection"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
