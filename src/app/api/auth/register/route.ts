import { userModel } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { cookies } from "next/headers";
import twilio from "twilio";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";
import { registerSchema } from "@/schemas/registerSchema";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  await connectToDB();
  const cookieStore = await cookies();
  const body = await req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: result.error?.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const { userName, fullName, email, password } = result.data;
  const generateOTP = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const user = await userModel.findOne({ email, emailVerified: true });
    if (user) {
      return NextResponse.json(
        {
          message: "Your account already exist please login.",
          success: false,
        },
        { status: 400 }
      );
    }

    let userExistbyEmail = await userModel.findOne({ email });
    if (userExistbyEmail) {
      if (userExistbyEmail.emailVerified) {
        return NextResponse.json({
          message: "User already exists with this email.",
          success: false,
        });
      } else {
        userExistbyEmail.userName = userName;
        userExistbyEmail.fullName = fullName;
        userExistbyEmail.password = password;
        userExistbyEmail.emailToken = generateOTP;
        await userExistbyEmail.save();
      }
    } else {
      // const expireyDate = new Date()
      // expireyDate.setHours(expiryData.getHours() + 1)
      userExistbyEmail = new userModel({
        userName,
        fullName,
        email,
        emailVerified: false,
        emailToken: generateOTP,
        password,
        // phoneNumber,
        // otp,
      });
      await userExistbyEmail.save();
    }

    const { password: pwd, ...rest } = userExistbyEmail.toObject();
    const token = jwt.sign({ user: rest }, process.env.TOKEN_SECRET as string, {
      expiresIn: "5m",
    });
    cookieStore.set("token", token);

    // send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      userName,
      emailToken: generateOTP,
    });

    if (!emailResponse?.success) {
      return NextResponse.json({
        message: emailResponse?.message,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Account created and otp sent successfully. Please verify OTP.",
      user: rest,
      token,
      success: true,
    });

    // for verification otp using twilio with phone number
    // const verificationCheck = await client.verify.v2
    //   .services(serviceSid as string)
    //   .verificationChecks.create({
    //     code: otp,
    //     to: `+91${phoneNumber}`,
    //   });
    // if (verificationCheck.status !== "approved") {
    //   return NextResponse.json({ success: false, message: "Invalid OTP" });
    // }
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while creating account.",
        error,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
