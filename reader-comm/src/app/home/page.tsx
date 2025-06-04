'use client'

import React, { useEffect, useState } from "react";
// Removed unused import
import BookInfoBox from "../../components/BookInfoBox";
import SearchBox from "../../components/SearchBox";
import axios from "axios";
import TopUsersComponent from "../../components/TopUsersComponent";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  // Removed unused variable DemoBookData

  const BookCategories = [
    "Fiction",
    "Kids",
    "Programming",
    "Self-Help",
    "Sciencex",
    "Mystery & Thriller",
    "Biography & Memoir",
    "History & Politics",
    "Philosophy & Psychology",
    "Business & Economics"
  ]
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookData, setBookData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showTopUsers, setShowTopUsers] = useState(false);

  const fetchAllBooks = async () => {
    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/book/all",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookData(response.data);
    } catch (error) {
      console.log(error);
      setBookData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooksByCategory = async (category: string) => {
    setIsLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/book/BookbyCategory/${category}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookData(response.data);
    } catch (error) {
      console.log(error);
      setBookData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      fetchAllBooks();
    } else {
      fetchBooksByCategory(category);
    }
    setShowDropdown(false); // Close dropdown after selection
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="pt-28 p-3">
        <div className="ml-10 flex gap-64">
          <SearchBox />

          <div onClick={() => setShowTopUsers(!showTopUsers)} className="  border-2 border-themeColor  flex gap-3  items-center justify-center rounded-md py-1 px-5 hover:cursor-pointer bg-[#c1f9f3]">
           <img width="15" height="15" src="/images/star-rating.png"/>
            View Top Readers
          </div>
        </div>


        <div className="flex items-center gap-5 mt-5 ml-12">
          <div 
            className={`border rounded-md py-1 px-5 text-sm hover:cursor-pointer ${
              selectedCategory === "all" ? "bg-themeColor text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            All Books
          </div>
          {BookCategories.slice(0, 5).map((category, index) => (
            <div 
              key={index} 
              className={`border rounded-md py-1 px-5 text-sm hover:cursor-pointer ${
                selectedCategory === category ? "bg-themeColor text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </div>
          ))}

          {/* Dropdown for remaining categories */}
          <div className="relative">
            <div
              className="border rounded-md py-1 px-5 hover:cursor-pointer bg-gray-100"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              More 
            </div>
            {showDropdown && (
              <div className="absolute left-0 mt-1 bg-white border rounded-md shadow-lg w-48 z-10">
                {BookCategories.slice(5).map((category, index) => (
                  <div
                    key={index}
                    className={`px-5 py-1 hover:bg-gray-200 cursor-pointer ${
                      selectedCategory === category ? "bg-blue-600 text-white" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="ml-12 text-gray-400">
            Browse from our varieties of books and find your flavor
          </p> 
        </div>

        <div className="flex flex-wrap flex-row gap-10 gap-y-10 p-5 mt-10 ml-10">
          {isLoading ? (
            <div className="w-full text-center text-gray-500">
              Loading books...
            </div>
          ) : bookData?.length > 0 ? (
            bookData.map((book: any) => (
              <BookInfoBox key={book._id} book={book} />
            ))
          ) : (
            <div className="w-full text-center">
              <div className="text-gray-500 text-lg">
                No books found in the {selectedCategory === "all" ? "library" : `"${selectedCategory}" category`}
              </div>
              <p className="text-gray-400 mt-2">
                Try selecting a different category or check back later for new additions.
              </p>
            </div>
          )}
        </div>
         <div className="my-10 flex items-center hover:cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-10 text-gray-400 hover:text-gray-600 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <p onClick={() => router.push('/book/addBook')} className="text-gray-400  ml-1 mt-1">Contribute book details to community </p>
          </div> 
      </div>
      {showTopUsers && <TopUsersComponent isOpen={showTopUsers} onClose={() => setShowTopUsers(false)} />}
    </div>
  );
};

export default HomePage;
