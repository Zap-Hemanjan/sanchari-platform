import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

// Cheap cookie-presence check only. Prisma (especially against SQLite)
// cannot run in the Edge runtime this proxy executes in, so the real
// session validation happens in src/app/admin/layout.tsx (Node runtime).
export function proxy(request: NextRequest) {
  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/hero",
    "/admin/categories/:path*",
    "/admin/testimonials/:path*",
    "/admin/gallery",
    "/admin/inquiries",
  ],
};
