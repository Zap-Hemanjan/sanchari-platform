import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { createResetToken, redeemResetToken } from "@/lib/tokens";

async function makeAdmin() {
  return prisma.adminUser.create({
    data: {
      email: "admin@example.com",
      passwordHash: "irrelevant-for-this-test",
      name: "Test Admin",
    },
  });
}

describe("password reset tokens", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("a freshly created token can be used exactly once", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    const result = await redeemResetToken(token);
    expect(result?.adminUserId).toBe(admin.id);
  });

  it("rejects reusing an already-consumed token", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    await redeemResetToken(token);
    const secondAttempt = await redeemResetToken(token);

    expect(secondAttempt).toBeNull();
  });

  it("rejects an unknown token", async () => {
    const result = await redeemResetToken("not-a-real-token");
    expect(result).toBeNull();
  });

  it("rejects an expired token", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    await prisma.passwordResetToken.updateMany({
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const result = await redeemResetToken(token);
    expect(result).toBeNull();
  });

  it("never stores the raw token in the database", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    const rows = await prisma.passwordResetToken.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).not.toBe(token);
  });
});
