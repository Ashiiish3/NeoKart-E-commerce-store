import { userModel } from "@/models/user.model";
import { loginSchema } from "@/schemas/loginSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectToDB();
  const cookieStore = await cookies();
  const body = await req.json();
  const result = loginSchema.safeParse(body);
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
  const { userName, email, password } = result.data;
  try {
    const user = await userModel.findOne({ $or: [{ email }, { userName }] });
    if (!user) {
      return NextResponse.json({ message: "Please create account first.", success: false });
    }
    const compPass = await bcrypt.compare(password, user?.password);
    if (!compPass) {
      return NextResponse.json({ message: "wrong password.", success: false });
    }
    const { password: pwd, ...rest } = user.toObject();
    const token = jwt.sign({ user: rest }, process.env.TOKEN_SECRET as string, {
      expiresIn: "1d",
    });
    cookieStore.set("token", token);
    return NextResponse.json({
      message: "login successfully.",
      user: rest,
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Login failed.",
      success: false,
      error,
    });
  }
}
