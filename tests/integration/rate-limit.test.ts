import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { recordAttempt, isRateLimited, MAX_ATTEMPTS } from "@/lib/rate-limit";

const IDENTIFIER = "someone@example.com";

describe("rate limiting", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("allows attempts under the threshold", async () => {
    for (let i = 0; i < MAX_ATTEMPTS - 1; i++) {
      await recordAttempt(IDENTIFIER, false);
    }

    await expect(isRateLimited(IDENTIFIER)).resolves.toBe(false);
  });

  it("locks out once the threshold of failed attempts is reached", async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await recordAttempt(IDENTIFIER, false);
    }

    await expect(isRateLimited(IDENTIFIER)).resolves.toBe(true);
  });

  it("does not count successful attempts toward lockout", async () => {
    for (let i = 0; i < MAX_ATTEMPTS + 5; i++) {
      await recordAttempt(IDENTIFIER, true);
    }

    await expect(isRateLimited(IDENTIFIER)).resolves.toBe(false);
  });

  it("does not lock out a different identifier", async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await recordAttempt(IDENTIFIER, false);
    }

    await expect(isRateLimited("someone-else@example.com")).resolves.toBe(
      false,
    );
  });

  it("resets after the window passes", async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await recordAttempt(IDENTIFIER, false);
    }

    // Push every recorded attempt outside the rate-limit window.
    await prisma.loginAttempt.updateMany({
      where: { identifier: IDENTIFIER },
      data: { attemptedAt: new Date(Date.now() - 60 * 60 * 1000) },
    });

    await expect(isRateLimited(IDENTIFIER)).resolves.toBe(false);
  });
});
