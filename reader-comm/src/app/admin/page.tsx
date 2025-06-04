'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/helpers/FormatDate'

interface Link {
  url: string;
  storeName: string;
}

const AdminDashboard = () => {
  const [books, setBooks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [allBooks, setAllBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('books') // 'books', 'orders', or 'allBooks'
  const [editingStock, setEditingStock] = useState<{id: string, stock: number} | null>(null)
  const [updatingStock, setUpdatingStock] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const admin = localStorage.getItem("admin")
    if (!admin) {
      router.push("/admin/login")
    } else {
      fetchBooks()
      fetchOrders()
      fetchAllBooks()
    }
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/book/getUnapproved')
      const data = await response.json()
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
  
  const fetchAllBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/book/all')
      const data = await response.json()
      setAllBooks(data)
    } catch (error) {
      console.error('Error fetching all books:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditingStock = (bookId: string, currentStock: number) => {
    setEditingStock({ id: bookId, stock: currentStock })
  }

  const cancelEditingStock = () => {
    setEditingStock(null)
  }

  const updateStock = async () => {
    if (!editingStock) return

    try {
      setUpdatingStock(true)
      const response = await fetch('/api/book/updateStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookId: editingStock.id,
          stock: editingStock.stock
        })
      })

      if (response.ok) {
        // Update local state to reflect the stock change
        setAllBooks(allBooks.map(book => 
          book._id === editingStock.id ? {...book, stock: editingStock.stock} : book
        ))
        setEditingStock(null)
      } else {
        const errorData = await response.json()
        alert(`Failed to update stock: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Failed to update stock. Please try again.')
    } finally {
      setUpdatingStock(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 mr-2 font-medium text-md rounded-t-lg ${
              activeTab === 'books' 
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('books')}
          >
            Book Approval
          </button>
          <button
            className={`py-3 px-6 mr-2 font-medium text-md rounded-t-lg ${
              activeTab === 'orders' 
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`py-3 px-6 font-medium text-md rounded-t-lg ${
              activeTab === 'allBooks' 
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('allBooks')}
          >
            View Books
          </button>
        </div>
        
        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'books' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Books Waiting for Approval</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border text-sm">
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
                    {books.length > 0 ? (
                      books.map((book) => (
                        <tr key={book._id} className="border hover:bg-gray-50">
                          <td className="border p-2">
                            {book.approved ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Approved
                              </span>
                            ) : (
                              <button 
                                onClick={() => approveBook(book._id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                              >
                                Approve
                              </button>
                            )}
                          </td>
                          <td className="border p-2 font-medium">{book.BookName}</td>
                          <td className="border p-2">{book.AuthorName}</td>
                          <td className="border p-2">{new Date(book.PublishedDate).toLocaleDateString()}</td>
                          <td className="border p-2">{book.CurrentVersionPublishDate ? new Date(book.CurrentVersionPublishDate).toLocaleDateString() : 'N/A'}</td>
                          <td className="border p-2">
                            <img src={book.BookCoverImage} alt={book.BookName} className="w-20 h-auto object-cover"/>
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={14} className="border p-4 text-center text-gray-500">
                          No books waiting for approval
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
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
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="border p-2 font-medium">{order._id}</td>
                          <td className="border p-2">{order.userId}</td>
                          <td className="border p-2">{order.bookId}</td>
                          <td className="border p-2">{new Date(order.createdAt || order.orderDate).toLocaleDateString()}</td>
                          <td className="border p-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="border p-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="border p-2 font-medium">${order.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="border p-4 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Books</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Book ID</th>
                      <th className="border p-2">Book Name</th>
                      <th className="border p-2">Author</th>
                      <th className="border p-2">Published Date</th>
                      <th className="border p-2">Cover Image</th>
                      <th className="border p-2">Pages</th>
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Rating</th>
                      <th className="border p-2">Stock</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBooks.length > 0 ? (
                      allBooks.map((book) => (
                        <tr key={book._id} className="border hover:bg-gray-50">
                          <td className="border p-2 font-medium">{book._id}</td>
                          <td className="border p-2 font-medium">{book.BookName}</td>
                          <td className="border p-2">{book.AuthorName}</td>
                          <td className="border p-2">{new Date(book.PublishedDate).toLocaleDateString()}</td>
                          <td className="border p-2">
                            <img src={book.BookCoverImage} alt={book.BookName} className="w-20 h-auto object-cover"/>
                          </td>
                          <td className="border p-2">{book.totalPages}</td>
                          <td className="border p-2">{book.category}</td>
                          <td className="border p-2">
                            <div>Avg: {book.Rating?.average || 0}</div>
                            <div>Reviews: {book.Rating?.noOFReviews || 0}</div>
                            <div>Total: {book.Rating?.totalRating || 0}</div>
                          </td>
                          <td className="border p-2">
                            {editingStock && editingStock.id === book._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={editingStock.stock}
                                  onChange={(e) => setEditingStock({
                                    ...editingStock,
                                    stock: parseInt(e.target.value) || 0
                                  })}
                                  className="w-20 p-1 border rounded"
                                />
                                <button
                                  onClick={updateStock}
                                  disabled={updatingStock}
                                  className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                >
                                  {updatingStock ? '...' : '✓'}
                                </button>
                                <button
                                  onClick={cancelEditingStock}
                                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                              </span>
                            )}
                          </td>
                          <td className="border p-2 font-medium">{book.price ? `$${book.price}` : 'N/A'}</td>
                          <td className="border p-2">
                            <button
                              onClick={() => startEditingStock(book._id, book.stock)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Edit Stock"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="border p-4 text-center text-gray-500">
                          No books found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard