import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("ekereAuthToken")?.value;
  const { pathname } = req.nextUrl;

  const protectedRoutes = [
    "/admin/dashboard",
    "/admin/tournaments",
    "/admin/schools",
    "/admin/leaderboard",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/admin", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/admin" && token) {
    const dashboardUrl = new URL("/admin/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/tournaments/:path*",
    "/admin/schools/:path*",
    "/admin/leaderboard/:path*",
  ],
};
