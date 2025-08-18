"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/type";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// app/register/page.tsx
export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth()
  const [openEye, setOpenEye] = useState(false);
  const userObj : User = {
    fullName: "",
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState<User>(userObj);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", formData);
      console.log(res)
      if(!res?.data?.success){
        toast.error(res?.data?.message)
      } else{
        login(res?.data?.user)
        toast.success(res?.data?.message)
        router.push("/register/email-verify")
      }
    } catch (error) {
      console.log(error, "while registering");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        {/* Full Name */}
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Username */}
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="userName"
            type="text"
            placeholder="john123"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={openEye ? "text" : "password"}
              placeholder="***********"
              value={formData.password}
              onChange={handleChange}
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
        {/* Submit */}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        {/* Link */}
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
