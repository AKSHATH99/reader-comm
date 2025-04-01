"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const booksData = [
  {
    id: 1,
    title: "Book 1",
    image: "/images/book1.jpg",
    buttonText: "Add to My Reading List",
    text : "Top Read Book Self-help category"
  },
  {
    id: 2,
    title: "Book 2",
    image: "/images/book2.jpg",
    buttonText: "Add to My Reading List",
    text : "Top Read Book Mythological-fiction category"
  },
  {
    id: 3,
    title: "Book 3",
    image: "/images/book3.jpg",
    buttonText: "Add to My Reading List",
    text : "Top Read Book Children Fiction category"
  },
  {
    id: 4,
    title: "Book 4",
    image: "/images/book4.jpg",
    buttonText: "Add to My Reading List",
    text : "Top Read Book Romance Fiction category"
  },
  {
    id: 5,
    title: "Book 5",
    image: "/images/book1.jpg",
    buttonText: "Add to My Reading List"
  },
  {
    id: 6,
    title: "Book 6",
    image: "/images/book1.jpg",
    buttonText: "Add to My Reading List"
  }
];

const blogsData = [
  {
    id: 1,
    title: "Top 10 books you should read in 2025",
    image: "/images/blog-image.jpg",
    text : "Top Read Blog of the Month",
    buttonText : "Read Blog",
    author: "Akshath P",
    date: "2024-01-01",

  },
  {
    id: 2,
    title: "Self-help books that will change your life",
    image: "/images/blog2.jpeg",
    text : "Top Read Blog of the Month",
    buttonText : "Read Blog",
    author: "Akshath P",
    date: "2024-01-01",
  },
  {
    id: 3,
    title: "My review about Harry Potter Series",
    image: "/images/blog3.jpg",
    text : "Top Read Blog of the Month",
    buttonText : "Read Blog",
    author: "Akshath P",
    date: "2024-01-01",
  },
  {
    id: 3,
    title: "Top Books for a sci-fi lover",
    image: "/images/blog4.jpeg",
    text : "Top Read Blog of the Month",
    buttonText : "Read Blog",
    author: "Akshath P",
    date: "2024-01-01",
  }
]

const testimonialsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Book Enthusiast",
    image: "/images/testimonial1.jpg",
    quote: "Book-Shelf has transformed my reading journey. The community recommendations are spot-on!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Avid Reader",
    image: "/images/testimonial2.jpg",
    quote: "The blog section is a goldmine of insights. I've discovered so many new authors here.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Book Blogger",
    image: "/images/testimonial3.jpg",
    quote: "As a book blogger, this platform has given me the perfect space to share my thoughts.",
    rating: 5
  }
];

export default function Home() {
  const router = useRouter();

  const checkLogin = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return true;
    } else {
      return false;
    }
  }

  const handleClick = () => {
    if (checkLogin()) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <div className="container mx-auto px-4">
        <div className="flex text-center items-center">
          <img
            src="/images/her-kid.jpg"
            alt="Books collection"
            className="w-1/3 h-[500px] p-3 ml-10 shadow-[8px_8px_0_rgba(20,184,166,0.3)] border-2 border-[#14b8a6] rounded-lg"
          />
          <div className="ml-10">
            <h1 className="text-xl md:text-6xl font-bold text-[#1A365D]">
              Welcome to <span className="text-[#14b8a6]">Book-Shelf</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl mt-2">
              Your digital sanctuary for all things books -{" "}
              <span className="text-[#14b8a6]">
                discover, share, and connect with fellow readers
              </span>
            </p>
            <div className="flex gap-4 mt-2 -ml-10 items-center justify-center">
              <button onClick={()=>{router.push("/signup")}} className="bg-[#14b8a6] text-white px-4 py-2 rounded-md mt-10">
                Become a Member
              </button>

              <button onClick={() => router.push("/home")} className="bg-[#14b8a6] text-white px-4 py-2 rounded-md mt-10">
                Explore Books
              </button>
            </div>

            <div className="relative top-20 text-[#a4a8a7] -ml-10">
              <span className="inline-flex flex-col mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 5l-7 7-7-7" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 -mt-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 5l-7 7-7-7" />
                </svg>
              </span>
              Scroll down to know more about us
            </div>
          </div>
        </div>

        <div className="mt-28 ml-10">
          <h1 className="text-4xl font-bold text-[#b3bab9]">
            Books , Blogs , Community & More . . .
          </h1>
          <div className="flex gap-4 mt-2">
            <div className="relative mt-5">
              <p className="text-3xl font-bold text-[#14b8a6] max-w-xl">
                Cant find what to read..?
              </p>

              <div className="mt-3">
                <p className="text-[20px] text-gray-400 max-w-xl">
                  Let us help you . Browse our wide range of books and find your
                  next favorite <span className="text-[#14b8a6] font-bold">read.....</span>
                </p>

                <div className="mt-10 flex flex-wrap gap-10">
                  {booksData.map((book) => (
                    <motion.div 
                      key={book.id}
                      className="w-[200px] shadow-[8px_8px_0_rgba(20,184,166,0.3)] border-2 border-[#14b8a6] rounded-lg"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "12px 12px 0 rgba(20,184,166,0.4)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-[250px] object-cover p-3"
                        whileHover={{ scale: 1.02 }}
                      />
                      <div className="flex justify-between p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-3"
                          viewBox="0 0 24 24"
                          fill="#d3c935"
                          stroke="#d3c935"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      <motion.p className="text-[10px]  text-[#d3c935] font-bold hover:cursor-pointer  transition-colors">{book.text}</motion.p>
                      </div>
                      <motion.button 
                        className="w-full py-2 text-sm text-gray-500 font-bold hover:text-[#14b8a6] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {book.buttonText}
                      </motion.button>
                    </motion.div>
                  ))}
                  <div onClick={() => router.push("/home")} className="w-[200px] shadow-[8px_8px_0_rgba(20,184,166,0.3)] border-2 border-[#14b8a6] rounded-lg hover:cursor-pointer">
                  <motion.img src="/images/callaction.png" alt="Books collection" className="w-full h-full object-cover blur-[3px] " whileHover={{ scale: 1.02 }}/>
                  <p className="text-white text-3xl font-bold relative bottom-[250px] p-3 " >Find My Next Read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-28 ml-10">
          <h1 className="text-3xl font-bold text-[#14b8a6] ">
            Find your taste from blogs and articles . . . 
          </h1>
          <p className="text-[15px] text-gray-400 max-w-xl mt-4">
            Our community is full of passionate readers and writers sharing their
            thoughts on books, writing, and reading through <span className="text-[#14b8a6]">blogs and articles</span>
          </p>
          <p className="text-[15px] text-gray-400 max-w-xl mt-4">
           And who knows ?  You might find new taste of reading from those . <span className="text-[#14b8a6]">Explore Now</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-10 ">
            {blogsData.map((blog) => (
              <motion.div 
                key={blog.id} 
                className="w-[300px] shadow-[8px_8px_0_rgba(20,184,166,0.3)] border-2 border-[#14b8a6] rounded-lg overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "12px 12px 0 rgba(20,184,166,0.4)"
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <motion.img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-[200px] object-cover"
                    whileHover={{ scale: 1.02 }}
                  />
                  <div className=" flex items-center justify-center absolute top-2 right-2 bg-[#ede32b] text-white px-2 py-1 rounded-md text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" fill="white" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {blog.text}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#1A365D] mb-2 line-clamp-2">{blog.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                  <motion.button 
                    className="w-full py-2 text-sm text-gray-500 font-bold hover:text-[#0d9488] transition-colors border-2 border-[#14b8a6] rounded-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {blog.buttonText}
                  </motion.button>
                </div>
              </motion.div>
            ))}
            <div className=" rounded-lg w-[300px] h-[300px] border-2 border-[#14b8a6] shadow-[8px_8px_0_rgba(20,184,166,0.3)]">
            <img src="/images/blog5.png" alt="Books collection" className="w-full h-1/2 " />
            <p className=" text-3xl font-bold p-5 pb-0 " >Find more blogs  </p>
            <p className="text-gray-400 py-5 px-2 text-sm -mt-2 ml-4 "> Find more blogs or write your own blogs about your reading experience and book suggestins </p>
            </div>
            
          </div>
        </div>

        <div className="mt-28 ml-10">
          <h1 className="text-3xl font-bold text-[#14b8a6] mb-8">
            What Our Readers Say
          </h1>
          <div className="flex flex-wrap gap-8">
            {testimonialsData.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="w-[350px] bg-white p-6 rounded-lg shadow-[8px_8px_0_rgba(20,184,166,0.3)] border-2 border-[#14b8a6]"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "12px 12px 0 rgba(20,184,166,0.4)"
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  {/* <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-[#14b8a6]"> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="User--Streamline-Block-Free" height="20" width="50"><desc>User Streamline Icon: https://streamlinehq.com</desc><path fill="#14b8a6" fill-rule="evenodd" d="M8 8c2.2091 0 4 -1.79086 4 -4s-1.7909 -4 -4 -4C5.79086 0 4 1.79086 4 4s1.79086 4 4 4Zm0 0c-4.41828 0 -8 3.5817 -8 8h16c0 -4.4183 -3.5817 -8 -8 -8Z" clip-rule="evenodd" stroke-width="1"></path></svg>
                  {/* </div> */}
                  <div>
                    <h3 className="font-bold text-[#1A365D]">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#d3c935]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-28 ml-10">
          <h1 className="text-3xl font-bold text-[#14b8a6] mb-8">
            Our Aim
          </h1>
          <div className="flex gap-10">
            <div>
          <p className="text-gray-400 max-w-xl mt-4">
            Hey there! We're all about creating a cozy corner where book lovers can hang out, 
            share their favorite reads, and connect with fellow bookworms. Think of us as your 
            bookish buddy who's always ready to chat about stories! <br/><br/>
            We're on a mission to make reading cool again by building a fun, friendly community 
            where everyone feels welcome to share their book adventures. <br/>
            Whether you're a reader looking for your next favorite book or a writer with stories 
            to share, we've got your back! Let's make reading awesome together! 
          </p>
          <p className="text-gray-700 max-w-xl mt-4">If you think our mission is cool and want to be part of this , come join us ! </p>
          <button className="bg-[#14b8a6] text-white mt-10 p-8 py-4 rounded-lg w-1/2">
            Join Us
          </button>
          </div>
          <img src="/images/aim.svg" alt="Books collection" className="w-1/2 h-1/2 -mt-32 " />
          </div>
        </div>

      </div>
    </div>
  );
}
