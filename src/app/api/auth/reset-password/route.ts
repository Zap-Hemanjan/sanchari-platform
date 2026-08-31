import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { redeemResetToken } from "@/lib/tokens";
import { hashPassword } from "@/lib/password";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: NextRequest) {
  const parsed = resetPasswordSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { token, newPassword } = parsed.data;

  const result = await redeemResetToken(token);
  if (!result) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.adminUser.update({
      where: { id: result.adminUserId },
      data: { passwordHash },
    }),
    // Force re-login everywhere after a password reset.
    prisma.session.deleteMany({ where: { adminUserId: result.adminUserId } }),
  ]);

  return NextResponse.json({ message: "Password updated. You can now log in." });
}
