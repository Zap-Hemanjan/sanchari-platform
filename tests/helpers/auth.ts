import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth-guard";

let counter = 0;

export async function createAuthenticatedAdmin() {
  counter += 1;
  const admin = await prisma.adminUser.create({
    data: {
      email: `admin-${counter}@example.com`,
      passwordHash: "irrelevant-for-this-test",
      name: "Test Admin",
    },
  });
  const { token } = await createSession(admin.id);
  return { admin, cookieHeader: `${SESSION_COOKIE_NAME}=${token}` };
}
