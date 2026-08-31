import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { hashPassword } from "@/lib/password";
import { SESSION_COOKIE_NAME } from "@/lib/auth-guard";
import { POST as login } from "@/app/api/auth/login/route";

function loginRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function makeAdmin(email: string, password: string) {
  return prisma.adminUser.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name: "Test Admin",
    },
  });
}

describe("POST /api/auth/login", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("logs in with correct credentials and sets a session cookie", async () => {
    await makeAdmin("admin@example.com", "correct-password");

    const response = await login(
      loginRequest({ email: "admin@example.com", password: "correct-password" }),
    );

    expect(response.status).toBe(200);
    const setCookie = response.cookies.get(SESSION_COOKIE_NAME);
    expect(setCookie?.value).toBeTruthy();

    const sessionCount = await prisma.session.count();
    expect(sessionCount).toBe(1);
  });

  it("rejects a wrong password with a generic message", async () => {
    await makeAdmin("admin@example.com", "correct-password");

    const response = await login(
      loginRequest({ email: "admin@example.com", password: "wrong-password" }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/invalid email or password/i);
  });

  it("rejects a login for an email that doesn't exist, with the same generic message", async () => {
    const response = await login(
      loginRequest({ email: "nobody@example.com", password: "whatever" }),
    );

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/invalid email or password/i);
  });

  // bcrypt at 12 rounds is deliberately slow; 6 sequential hash/verify calls
  // in one test can exceed Vitest's default 5s timeout under load.
  it(
    "locks out after repeated failed attempts",
    async () => {
      await makeAdmin("admin@example.com", "correct-password");

      for (let i = 0; i < 5; i++) {
        await login(
          loginRequest({ email: "admin@example.com", password: "wrong-password" }),
        );
      }

      const response = await login(
        loginRequest({ email: "admin@example.com", password: "correct-password" }),
      );

      expect(response.status).toBe(429);
    },
    15000,
  );
});
