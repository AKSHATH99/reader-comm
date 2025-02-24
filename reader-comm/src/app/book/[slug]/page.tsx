"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const BookPage = () => {
  interface Book {
    BookCoverImage: string;
    BookName: string;
    Rating: string;
    AuthorName: string;
    PublishedDate: string;
    category: string;
  }

  interface BookReview {
    _id: string;
    bookId: string;
    contentType: string;
    userId: string;
    reviewText: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface Rating {
    average: number;
    noOFReviews: number;
    totalRating: number;
  }

  interface BookRatings {
    Rating: Rating;
    _id: string;
  }

  interface ApiResponse {
    message: string;
    bookRatings: BookRatings;
    bookReviews: BookReview[];
  }

  const router = useRouter();
  const params = useParams();

  const slug: any = params.slug;
  const bookid = decodeURIComponent(slug);

  const [book, setBook] = useState<Book | null>(null);
  const [reviewdata, setReviewData] = useState<ApiResponse | null>(null);

  const FetchBookDetails = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/book/${bookid}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      setBook(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const FetchReviews = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/review/BookReviews/${bookid}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      setReviewData(response.data)
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    FetchBookDetails();
    FetchReviews()
  }, []);
  useEffect(() => {
    console.log(book);
  }, [book]);

  useEffect(() => {
    console.log(reviewdata);
  }, [reviewdata]);

  return (
    <div>
      {book ? (
        <div>
          <div className="overflow-hidden rounded-lg mb-4">
            <img src={book.BookCoverImage} alt="Book Cover" className="h-20" />
          </div>
          {book.AuthorName}
          <br />
          {book.BookName}
          <br />
          {book.PublishedDate}
          <br />
          {/* {book.Rating} */}
          <br />
          {book.category}
          <br />

        <div>
          <p className="text-4xl">Reviews</p>
          {reviewdata?.bookRatings.Rating.average}
          <br />

          {reviewdata?.bookRatings.Rating.noOFReviews}
          <br />

          {reviewdata?.bookRatings.Rating.totalRating}

          {reviewdata?.bookReviews.map((review) => (
  <div key={review._id}>
    <p>Review: {review.reviewText}</p>
    <p>Rating: {review.rating}</p>
  </div>
))}

          </div>


        </div>


      ) : (
        "Loading details"
      )}
    </div>
  );
};

export default BookPage;
