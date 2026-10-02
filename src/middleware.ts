import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Ignore static assets, images, favicon, api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/login";

  // If user is trying to access login page while authenticated, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is trying to access protected pages without token, redirect to /login
  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes if any)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
