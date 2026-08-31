import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  adminUserId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      adminUserId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function validateSession(
  token: string,
): Promise<{ adminUserId: string } | null> {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return { adminUserId: session.adminUserId };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}
