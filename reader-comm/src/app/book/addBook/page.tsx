'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    BookName: '',
    AuthorName: '',
    PublishDate: '',
    CurrentVersionPublishDate: '',
    totalPages: '',
    category: '',
    BookDescription: '',
    stock: 0,
    BookCoverImage: null as File | null,
    bookPdf: null as File | null,
    available: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      if (fileInput.files && fileInput.files[0]) {
        setFormData(prev => ({
          ...prev,
          [name]: fileInput.files![0]
        }))
      }
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString())
        } else if (value instanceof File) {
          formDataToSend.append(key, value)
        } else {
          formDataToSend.append(key, value as string)
        }
      }
    })

    try {
      const response = await fetch('/api/book/addBook', {
        method: 'POST',
        body: formDataToSend
      })    

      if (response.ok) {
        alert('Book added successfully!')
        router.push('/home')
      } else {
        alert('Failed to add book. Please try again.')
      }
    } catch (error) {
      console.error('Error adding book:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className='h-max'>
      Contribute book details to community
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book Name</label>
              <input
                type="text"
                name="BookName"
                value={formData.BookName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author Name</label>
              <input
                type="text"
                name="AuthorName"
                value={formData.AuthorName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Publish Date</label>
              <input
                type="date"
                name="PublishDate"
                value={formData.PublishDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Version Publish Date</label>
              <input
                type="date"
                name="CurrentVersionPublishDate"
                value={formData.CurrentVersionPublishDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Pages</label>
              <input
                type="number"
                name="totalPages"
                value={formData.totalPages}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              >
                <option value="">Select a category</option>
                <option value="Programming">Programming</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Book Description</label>
              <textarea
                name="BookDescription"
                value={formData.BookDescription}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Book Cover Image</label>
              <input
                type="file"
                name="BookCoverImage"
                onChange={handleChange}
                accept="image/*"
                className="mt-1 block w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Book PDF</label>
              <input
                type="file"
                name="bookPdf"
                onChange={handleChange}
                accept=".pdf"
                className="mt-1 block w-full"
                required
              />
            </div>


            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Book Details
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default page
   