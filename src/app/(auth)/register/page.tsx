"use client"
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// app/register/page.tsx
export default function RegisterPage() {
    const [openEye, setOpenEye] = useState(false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            placeholder="John2"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="w-full flex px-4 py-2 border rounded-md focus:outline-none focus-within:ring focus-within:border-blue-400">
            <input
              type={openEye ? "text" : "password"}
              id="password"
              className="focus:outline-none w-full pe-2"
              placeholder="***********"
              required
            />
            {openEye ? <Eye strokeWidth={1.5} onClick={()=>setOpenEye(!openEye)} className="cursor-pointer" /> : <EyeOff strokeWidth={1.5} onClick={()=>setOpenEye(!openEye)} className="cursor-pointer" />}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
