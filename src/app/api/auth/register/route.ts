import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { cookies } from "next/headers";
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_SERVICE_SID

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  await connectToDB();
  const cookieStore = await cookies();
  const { userName, fullName, email, password, phoneNumber, otp } =
    await req.json();
  try {
    if (!userName || !fullName || !email || !password || !phoneNumber || !otp) {
      return NextResponse.json({
        message: "All field required.",
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return NextResponse.json({
        message: "Your account already exist please login.",
        success: false,
      });
    }
    const verificationCheck = await client.verify.v2
      .services(serviceSid as string)
      .verificationChecks.create({
        code: otp,
        to: `+91${phoneNumber}`,
      });
    if (verificationCheck.status !== "approved") {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }

    const newUser = await userModel.create({
      userName,
      fullName,
      email,
      password,
      phoneNumber,
      otp,
    });
    const { password: pwd, ...rest } = newUser._doc;
    const token = jwt.sign({ user: rest }, process.env.TOKEN_SECRET as string, {
      expiresIn: "5m",
    });
    console.log(rest);
    console.log(newUser);
    cookieStore.set("token", token);
    return NextResponse.json({
      message: "Account has been created successfully.",
      user: rest,
      token,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "error while creating account.",
      error,
      success: false,
    });
  }
}