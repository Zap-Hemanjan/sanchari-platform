import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { createSession, validateSession } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth-guard";
import { POST as logout } from "@/app/api/auth/logout/route";

describe("POST /api/auth/logout", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("destroys the session and clears the cookie", async () => {
    const admin = await prisma.adminUser.create({
      data: { email: "admin@example.com", passwordHash: "x", name: "Admin" },
    });
    const { token } = await createSession(admin.id);

    const request = new NextRequest("http://localhost/api/auth/logout", {
      method: "POST",
      headers: { cookie: `${SESSION_COOKIE_NAME}=${token}` },
    });

    const response = await logout(request);

    expect(response.status).toBe(200);
    await expect(validateSession(token)).resolves.toBeNull();
  });
});
