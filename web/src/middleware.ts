import { type NextRequest, NextResponse } from "next/server";
import {
  AUTH_ROUTES,
  HOME_ROUTE,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  SESSION_COOKIE_NAME,
} from "./lib/constants/constants";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";
  const currentPath = request.nextUrl.pathname;

  // Allow access to public routes without checking session
  if (PUBLIC_ROUTES.includes(currentPath)) {
    return NextResponse.next(); // Allow access to public route
  }

  // Redirect to login if the session is not set and trying to access a protected route
  if (!session && PROTECTED_ROUTES.includes(currentPath)) {
    const loginURL = new URL(AUTH_ROUTES[0], request.nextUrl.origin); // Redirect to /signin
    return NextResponse.redirect(loginURL.toString());
  }

  // Redirect to dashboard if session is set and user tries to access signin/signup
  if (session && AUTH_ROUTES.includes(currentPath)) {
    const dashboardURL = new URL(HOME_ROUTE, request.nextUrl.origin); // Redirect to dashboard or first home route
    return NextResponse.redirect(dashboardURL.toString());
  }

  // Default: Allow request to proceed
  return NextResponse.next();
}
