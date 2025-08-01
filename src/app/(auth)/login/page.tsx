"use client"
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// app/login/page.tsx
export default function LoginPage() {
    const [openEye, setOpenEye] = useState(false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email/Username
          </label>
          <input
            type="text"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
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
          Sign In
        </button>
        <p className="text-center text-sm text-gray-500">
          Do not have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
