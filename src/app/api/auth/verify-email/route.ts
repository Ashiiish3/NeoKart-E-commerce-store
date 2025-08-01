import { connectToDB } from "@/lib/db";
import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();
  const { email, emailToken } = await req.json();
  const user = await userModel.findOne({ email });
  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }
  if (user.emailToken == emailToken) {
    await user.updateOne({emailVerified: true, emailToken})
    return NextResponse.json({
      success: true,
      message: "Email verify successfully.",
    });
  } else {
    return NextResponse.json({ message: "Invalid OTP", success: false });
  }
}
