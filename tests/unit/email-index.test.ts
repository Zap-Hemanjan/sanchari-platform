import { describe, it, expect, afterEach } from "vitest";
import { getEmailAdapter } from "@/lib/email";
import { ConsoleEmailAdapter } from "@/lib/email/console-email";
import { ResendEmailAdapter } from "@/lib/email/resend-email";

const originalKey = process.env.RESEND_API_KEY;

afterEach(() => {
  if (originalKey === undefined) {
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.RESEND_API_KEY = originalKey;
  }
});

describe("getEmailAdapter", () => {
  it("returns ConsoleEmailAdapter when RESEND_API_KEY is unset", () => {
    delete process.env.RESEND_API_KEY;
    expect(getEmailAdapter()).toBeInstanceOf(ConsoleEmailAdapter);
  });

  it("returns ResendEmailAdapter when RESEND_API_KEY is set", () => {
    process.env.RESEND_API_KEY = "re_fake_key";
    expect(getEmailAdapter()).toBeInstanceOf(ResendEmailAdapter);
  });
});
