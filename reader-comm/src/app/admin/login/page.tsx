'use client'
import { useRouter } from 'next/navigation'
import React,{useEffect, useState} from 'react'

const page = () => {

    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [adminEmail, setAdminEmail] = useState<string | null>(null)
    const [adminPassword, setAdminPassword] = useState<string | null>(null)

    function setItemWithExpiry(key:string, value:string, ttl:number) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl, // ttl (time to live) in milliseconds
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    useEffect(() => {
        setAdminEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || null)
        setAdminPassword(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || null)
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("broooo")
        if(email === adminEmail && password === adminPassword){
            setItemWithExpiry("admin", "true", 30 * 60 * 1000)
            router.push("/admin")
        }else{
            alert("Invalid email or password")
        }
    }

    useEffect(()=>{
        console.log("for admin",email,password)
    },[email,password])
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-bold text-[#1A365D]">Admin Login</h2>
          </div>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#14b8a6] focus:border-[#14b8a6]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#14b8a6] focus:border-[#14b8a6]"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={(e)=>{handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A365D] hover:bg-[#14b8a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14b8a6]"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page
