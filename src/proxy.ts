import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin routes authorization check (bypasses storefront site_access gate)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2. Exempt internal, static, API, access gate, and well-known paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/access") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/.well-known") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Check site access passcode cookie for storefront
  const siteAccess = request.cookies.get("site_access")?.value;

  if (siteAccess !== "true") {
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
