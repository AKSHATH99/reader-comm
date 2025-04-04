import React, { useState } from 'react';
import axios from 'axios';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowResults(true);
    try {
      const response = await axios.get(`/api/book/s/${searchQuery}`);
      if (response.data === "Books not found") {

        setSearchResults([]);
      } else {
        setSearchResults(response.data);
        console.log(response.data);

      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  return (
    <div className='relative w-1/2'>
      <div className='flex'>
        <input 
          placeholder='Search for your book here' 
          type='text' 
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className='border rounded-l-xl w-3/4 h-10 p-3 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent' 
        />
        <button 
          onClick={handleSearch}
          className='border rounded-r-xl h-10 px-6 bg-themeColor text-white hover:bg-themeHover transition-colors'
        >
          Search
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className='absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='p-4 text-center text-gray-500'>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className='py-2'>
              {searchResults.map((book) => (
                <a href={`/book/${book._id}`}><div 
                  key={book._id} 
                  className='px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4'
                >
                  {book.BookCoverImage && (
                    <img 
                      src={book.BookCoverImage} 
                      alt={book.BookName} 
                      className='w-12 h-16 object-cover rounded'
                    />
                  )}
                  <div>
                    <h3 className='font-medium text-gray-900'>{book.BookName}</h3>
                    <p className='text-sm text-gray-500'>by {book.AuthorName}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs text-gray-400'>{book.category}</span>
                      {/* {book.Rating && (
                        <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded'>
                          ★ {book.Rating}
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
                </a>
              ))}
            </div>
          ) : (
            <div className='p-4 text-center text-gray-500'>
              No books found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
