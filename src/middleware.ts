import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/wallet", "/dashboard", "/admin"];

export function middleware(request: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!isProtected || request.cookies.has("session")) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/wallet/:path*", "/dashboard/:path*", "/admin/:path*"],
};
