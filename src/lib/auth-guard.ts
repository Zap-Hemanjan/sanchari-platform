import type { NextRequest } from "next/server";
import { validateSession } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

export { SESSION_COOKIE_NAME };

export async function getAdminSession(
  request: NextRequest,
): Promise<{ adminUserId: string } | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}
