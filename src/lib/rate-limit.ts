import { prisma } from "@/lib/prisma";

export const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function recordAttempt(
  identifier: string,
  success: boolean,
): Promise<void> {
  await prisma.loginAttempt.create({
    data: { identifier, success },
  });
}

export async function isRateLimited(identifier: string): Promise<boolean> {
  const failedCount = await prisma.loginAttempt.count({
    where: {
      identifier,
      success: false,
      attemptedAt: { gt: new Date(Date.now() - WINDOW_MS) },
    },
  });

  return failedCount >= MAX_ATTEMPTS;
}
