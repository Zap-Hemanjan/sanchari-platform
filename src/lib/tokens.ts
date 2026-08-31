import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createResetToken(
  adminUserId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(token),
      adminUserId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

// Atomically marks the token used only if it is currently valid and unused,
// so two concurrent requests with the same token can't both succeed.
export async function redeemResetToken(
  token: string,
): Promise<{ adminUserId: string } | null> {
  const tokenHash = hashToken(token);

  const { count } = await prisma.passwordResetToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  });

  if (count !== 1) {
    return null;
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  return record ? { adminUserId: record.adminUserId } : null;
}
