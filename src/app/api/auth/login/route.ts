import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { recordAttempt, isRateLimited } from "@/lib/rate-limit";
import { SESSION_COOKIE_NAME } from "@/lib/auth-guard";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const GENERIC_ERROR = "Invalid email or password.";

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (await isRateLimited(email)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const passwordOk = admin
    ? await verifyPassword(password, admin.passwordHash)
    : false;

  await recordAttempt(email, passwordOk);

  if (!admin || !passwordOk) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(admin.id);

  const response = NextResponse.json({
    id: admin.id,
    email: admin.email,
    name: admin.name,
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
