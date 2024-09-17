import { type NextRequest, NextResponse } from "next/server";
import { authRoutes, HOME_ROUTE, protectedRoutes, ROOT_ROUTE, SESSION_COOKIE_NAME } from "./lib/constants/constants";



export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  // Redirect to login if session is not set
  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(authRoutes, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Redirect to home if session is set and user tries to access the root
  if (session && request.nextUrl.pathname === ROOT_ROUTE) {
    const absoluteURL = new URL(HOME_ROUTE[0], request.nextUrl.origin); // Redirect to the first home route in the array
    return NextResponse.redirect(absoluteURL.toString());
  }
}


