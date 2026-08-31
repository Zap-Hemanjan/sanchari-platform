import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { createResetToken } from "@/lib/tokens";
import { createSession, validateSession } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { POST as resetPassword } from "@/app/api/auth/reset-password/route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/auth/reset-password", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function makeAdmin() {
  return prisma.adminUser.create({
    data: { email: "admin@example.com", passwordHash: "old-hash", name: "Admin" },
  });
}

describe("POST /api/auth/reset-password", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("resets the password with a valid token", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    const response = await resetPassword(
      request({ token, newPassword: "brand-new-password" }),
    );

    expect(response.status).toBe(200);
    const updated = await prisma.adminUser.findUniqueOrThrow({
      where: { id: admin.id },
    });
    await expect(
      verifyPassword("brand-new-password", updated.passwordHash),
    ).resolves.toBe(true);
  });

  it("invalidates existing sessions after a password reset", async () => {
    const admin = await makeAdmin();
    const { token: sessionToken } = await createSession(admin.id);
    const { token: resetToken } = await createResetToken(admin.id);

    await resetPassword(request({ token: resetToken, newPassword: "new-password-123" }));

    await expect(validateSession(sessionToken)).resolves.toBeNull();
  });

  it("rejects an invalid token", async () => {
    const response = await resetPassword(
      request({ token: "not-a-real-token", newPassword: "new-password-123" }),
    );
    expect(response.status).toBe(400);
  });

  it("rejects reusing a token twice", async () => {
    const admin = await makeAdmin();
    const { token } = await createResetToken(admin.id);

    await resetPassword(request({ token, newPassword: "first-new-password" }));
    const second = await resetPassword(
      request({ token, newPassword: "second-new-password" }),
    );

    expect(second.status).toBe(400);
  });
});
