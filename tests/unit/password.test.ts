import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password", () => {
  it("hashes a password into something that is not the plaintext", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toBe("correct horse battery staple");
    expect(hash.length).toBeGreaterThan(20);
  });

  it("produces a different hash each time (salted)", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
  });

  it("verifies a correct password against its hash", async () => {
    const hash = await hashPassword("my-secret-pw");
    await expect(verifyPassword("my-secret-pw", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password against a hash", async () => {
    const hash = await hashPassword("my-secret-pw");
    await expect(verifyPassword("wrong-password", hash)).resolves.toBe(false);
  });

  it("rejects an empty password against a real hash", async () => {
    const hash = await hashPassword("my-secret-pw");
    await expect(verifyPassword("", hash)).resolves.toBe(false);
  });
});
