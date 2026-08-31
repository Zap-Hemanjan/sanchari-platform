import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { POST as forgotPassword } from "@/app/api/auth/forgot-password/route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/auth/forgot-password", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(async () => {
    await resetDb();
    delete process.env.RESEND_API_KEY; // use console adapter, avoid real network calls
  });
  afterAll(resetDb);

  it("returns the same response for an existing email as for a non-existent one", async () => {
    await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "x", name: "Admin" },
    });

    const existingResponse = await forgotPassword(
      request({ email: "admin@example.com" }),
    );
    const missingResponse = await forgotPassword(
      request({ email: "nobody@example.com" }),
    );

    expect(existingResponse.status).toBe(missingResponse.status);
    expect(await existingResponse.json()).toEqual(await missingResponse.json());
  });

  it("actually creates and emails a reset token when the email exists", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "x", name: "Admin" },
    });

    await forgotPassword(request({ email: "admin@example.com" }));

    const tokenCount = await prisma.passwordResetToken.count();
    expect(tokenCount).toBe(1);

    const loggedOutput = logSpy.mock.calls.map((c) => c.join(" ")).join("\n");
    expect(loggedOutput).toContain("admin@example.com");
    expect(loggedOutput).toMatch(/reset-password/);

    logSpy.mockRestore();
  });

  it("creates no token when the email doesn't exist", async () => {
    await forgotPassword(request({ email: "nobody@example.com" }));
    await expect(prisma.passwordResetToken.count()).resolves.toBe(0);
  });

  it("rate-limits repeated requests for the same email", async () => {
    await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "x", name: "Admin" },
    });

    for (let i = 0; i < 5; i++) {
      await forgotPassword(request({ email: "admin@example.com" }));
    }

    const response = await forgotPassword(request({ email: "admin@example.com" }));
    expect(response.status).toBe(429);
  });
});
