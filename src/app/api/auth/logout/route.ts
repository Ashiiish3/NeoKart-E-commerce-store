import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "You logout successfully.",
      success: true,
    });
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong.",
      success: false,
      error,
    });
  }
}