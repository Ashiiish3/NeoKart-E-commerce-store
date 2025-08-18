"use client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/types/type";

// app/login/page.tsx
export default function LoginPage() {
   const router = useRouter();
  const {login, user} = useAuth()
  const [openEye, setOpenEye] = useState(false);
  const userObj: LoginForm = {
    identifier: "",
    password: "",
  };
  const [formData, setFormData] = useState<LoginForm>(userObj);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isEmail = formData.identifier.includes("@")
    const payload = {
      [isEmail ? "email" : "userName"]: formData.identifier,
      password: formData.password
    }
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", payload)
      if(!res?.data?.success){
        toast.error(res?.data?.message)
      }else{
        login(res?.data?.user)
        toast.success(res?.data?.message)
        router.push("/")
      }
    } catch (error) {
      console.log(error, "error while login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <div className="space-y-2">
          <Label htmlFor="identifier">Email/Username</Label>
          <Input
            id="identifier"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="you@example.com or username"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={openEye ? "text" : "password"}
              name="password"
              value={formData.password}
            onChange={handleChange}
              placeholder="***********"
              className="pr-10"
              required
            />
            <span
              className="absolute right-2 top-2 cursor-pointer text-gray-500"
              onClick={() => setOpenEye(!openEye)}
            >
              {openEye ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
