import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(pathname, "pathname");

  // Allow public routes without token
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }
  const token = req.cookies.get("token")?.value;
  console.log(token, "token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // protect all routes under /dashboard or /profile etc.
    "/products/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
  //  runtime: "nodejs"
};
