import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import { createSession, validateSession, destroySession } from "@/lib/session";

async function makeAdmin() {
  return prisma.adminUser.create({
    data: {
      email: "admin@example.com",
      passwordHash: "irrelevant-for-this-test",
      name: "Test Admin",
    },
  });
}

describe("session", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates a session and can validate it back to the admin user", async () => {
    const admin = await makeAdmin();
    const { token } = await createSession(admin.id);

    const result = await validateSession(token);

    expect(result?.adminUserId).toBe(admin.id);
  });

  it("never stores the raw token in the database", async () => {
    const admin = await makeAdmin();
    const { token } = await createSession(admin.id);

    const rows = await prisma.session.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).not.toBe(token);
  });

  it("rejects a token that doesn't exist", async () => {
    const result = await validateSession("not-a-real-token");
    expect(result).toBeNull();
  });

  it("rejects an expired session", async () => {
    const admin = await makeAdmin();
    const { token } = await createSession(admin.id);

    await prisma.session.updateMany({
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const result = await validateSession(token);
    expect(result).toBeNull();
  });

  it("destroySession invalidates the token", async () => {
    const admin = await makeAdmin();
    const { token } = await createSession(admin.id);

    await destroySession(token);

    const result = await validateSession(token);
    expect(result).toBeNull();
  });
});
