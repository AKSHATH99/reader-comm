'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Link {
  url: string;
  storeName: string;
}

const page = () => {

  const [books, setBooks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const [orders, setOrders] = React.useState<any[]>([])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/book/getUnapproved')
      const data = await response.json()
      console.log(data)
      setBooks(data.books)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveBook = async (bookId: string) => {
    try {
      const response = await fetch('/api/book/approveBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId })
      })
      
      if (response.ok) {
        // Update the local state to reflect the approval
        setBooks(books.map(book => 
          book._id === bookId ? {...book, approved: true} : book
        ))
      }
    } catch (error) {
      console.error('Error approving book:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/viewOrders')
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchOrders()
  }, [])

const router = useRouter()
    useEffect(()=>{
        const admin = localStorage.getItem("admin")
        if(!admin){
            router.push("/admin/login")
        }
    },[])

  return (
    <div className='flex flex-col items-center   h-screen p-10'>

        <p>Books waiting for approval</p>

        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Action</th>
              <th className="border p-2">Book Name</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Published Date</th>
              <th className="border p-2">Current Version Date</th>
              <th className="border p-2">Cover Image</th>
              <th className="border p-2">Pages</th>
              <th className="border p-2">PDF Link</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Store Links</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border">
                <td className="border p-2">
                  { book.approved ? <p> ✅ Approved</p> : <button 
                    onClick={() => approveBook(book._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Approve
                  </button>}
                </td>
                <td className="border p-2">{book.BookName}</td>
                <td className="border p-2">{book.AuthorName}</td>
                <td className="border p-2">{new Date(book.PublishedDate).toLocaleDateString()}</td>
                <td className="border p-2">{book.CurrentVersionPublishDate ? new Date(book.CurrentVersionPublishDate).toLocaleDateString() : 'N/A'}</td>
                <td className="border p-2">
                  <img src={book.BookCoverImage} alt={book.BookName} className="w-20 h-auto"/>
                </td>
                <td className="border p-2">{book.totalPages}</td>
                <td className="border p-2">
                  <a href={book.BookPDFLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View PDF
                  </a>
                </td>
                <td className="border p-2">{book.category}</td>
                <td className="border p-2">
                  <div>Avg: {book.Rating.average}</div>
                  <div>Reviews: {book.Rating.noOFReviews}</div>
                  <div>Total: {book.Rating.totalRating}</div>
                </td>
                <td className="border p-2">
                  {book.Links?.map((link: Link, index: number) => (
                    <div key={index}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link.storeName}
                      </a>
                    </div>
                  ))}
                </td>
                <td className="border p-2">
                  <div className="max-w-xs overflow-hidden text-ellipsis">
                    {book.BookDescription}
                  </div>
                </td>
                <td className="border p-2">{book.stock}</td>
                <td className="border p-2">
                  <div>Available: {book.available ? 'Yes' : 'No'}</div>
                  <div>Approved: {book.approved ? 'Yes' : 'No'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
        <p className='mt-20'>Orders</p>
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Book</th>
              <th className="border p-2">Order Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.userId}</td>
                <td className="border p-2">{order.bookId}</td>
                <td className="border p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{order.paymentStatus}</td>
                <td className="border p-2">${order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
              
              
                
    </div>
  )
}

export default page
