import React from 'react'
import HeaderComponent from '../../components/HeaderComponent'
import BookInfoBox from '../../components/BookInfoBox'

const HomePage = () => {

  const DemoBookData = [
    {
      "id": 1,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt, David Thomas",
      "genre": "Programming",
      "published_year": 1999,
      "rating": 5,      "cover_image": "https://books.google.co.in/books/content?id=5wBQEp6ruIAC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U1571Ssmd_XMXP7jp8SQA5id0GAMw&w=1280"
    },
    {
      "id": 2,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "genre": "Programming",
      "published_year": 2008,
      "rating": 5,
      "cover_image": "https://books.google.co.in/books/publisher/content?id=7KnBDwAAQBAJ&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0tS5rfkWZZe1tYMneCsc3WQy_mug&w=1280"
    },
    {
      "id": 3,
      "title": "The Clean Coder",
      "author": "Robert C. Martin",
      "genre": "Programming",
      "published_year": 2011,
      "rating": 5,
      "cover_image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1472119680i/27833670.jpg"
    },
    {
      "id": 4,
      "title": "Refactoring: Improving the Design of Existing Code",
      "author": "Martin Fowler",
      "genre": "Software Engineering",
      "published_year": 1999,
      "rating": 5,
      "cover_image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1353277730i/11588.jpg"
    },
    {
      "id": 5,
      "title": "You Don’t Know JS",
      "author": "Kyle Simpson",
      "genre": "JavaScript",
      "published_year": 2015,
      "rating": 5,
      "cover_image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1561623832i/35286872.jpg"
    },
    {
      "id": 6,
      "title": "JavaScript: The Good Parts",
      "author": "Douglas Crockford",
      "genre": "JavaScript",
      "published_year": 2008,
      "rating": 5,
      "cover_image": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg"
    },
   
  ]
  

  return (
    <div>
      <HeaderComponent/>
      <div className='mt-10 p-3'>

      Browse from our varities of books and find your flavour 

      <div className='flex  flex-wrap flex-row gap-10 gap-y-10 p-5 mt-10'>
      {DemoBookData.map((book)=>{
        return (
          <BookInfoBox book={book} />
        )
      })}
      </div>
     
      </div>


    </div>
  )
}

export default HomePage
