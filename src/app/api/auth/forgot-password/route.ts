import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/tokens";
import { getEmailAdapter } from "@/lib/email";
import { recordAttempt, isRateLimited } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

// Always the same shape and status regardless of outcome, so the endpoint
// can't be used to enumerate which emails have admin accounts.
const GENERIC_RESPONSE = {
  message: "If that email exists, a password reset link has been sent.",
};

export async function POST(request: NextRequest) {
  const parsed = forgotPasswordSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const { email } = parsed.data;

  if (await isRateLimited(email)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  await recordAttempt(email, false);

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (admin) {
    const { token } = await createResetToken(admin.id);
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reset-password/${token}`;

    await getEmailAdapter().send({
      to: admin.email,
      subject: "Reset your Sanchari admin password",
      html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
