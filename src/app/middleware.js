import { NextResponse } from "next/server";

export function middleware(request) {
  const user = request.cookies.get("user"); // veya kullandığınız auth yöntemine göre

  if (request.nextUrl.pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/home2", request.url));
    }
    // Kullanıcı giriş yapmamışsa, varsayılan ana sayfaya yönlendir
    return NextResponse.next();
  }

  // Diğer sayfalar için kontrol
  if (!user && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home2", "/profile", "/randevular"],
};
