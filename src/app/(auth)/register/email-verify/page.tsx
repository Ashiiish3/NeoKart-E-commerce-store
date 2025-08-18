"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function EmailVerify() {
  const router = useRouter();
  const { user } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // for handling timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  // when user past OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").map((d) => d);
      setOtp((prev) => [...newOtp, ...prev.slice(pasteData.length)]);
      newOtp.forEach((digit, idx) => {
        if (otpRefs.current[idx]) {
          otpRefs.current[idx].value = digit;
        }
      });
    }
  };
  // handle OTP change
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d+$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // for deleting otp value
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) { 
        otpRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // verify otp
  const verifyOTP = async () => {
    setIsVerifying(true);
    try {
      setTimeout(() => {
        setIsVerifying(false);
      }, 1000);
      const res = await axios.post("http://localhost:3000/api/auth/verify-email", {email: user?.email, emailToken: otp.join("")})
      if(!res?.data?.success){
        toast.error(res?.data?.message || "OTP is not correct")
      } else {
        toast.success(res?.data?.message || "Email Verification Done")
        router.push("/")
      }
    } catch (error) {
      console.log("otp is not correct.", error)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-blue-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 text-sm">
            We have sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">{user?.email}</p>
        </div>
        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          <div className="flex justify-center space-x-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) {
                    otpRefs.current[index] = el;
                  }
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-gray-600 text-sm">
              Did not receive the code? Resend in{" "}
              <span className="font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              // onClick={handleResend}
              // disabled={!canResend}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium disabled:text-gray-400"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyOTP}
          disabled={isVerifying || otp.some((digit) => !digit)}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="animate-spin mr-2" size={16} />
              Verifying...
            </div>
          ) : (
            "Verify Email"
          )}
        </button>
      </div>
    </div>
  );
}