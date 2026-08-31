import { describe, it, expect, vi, afterEach } from "vitest";
import { ConsoleEmailAdapter } from "@/lib/email/console-email";

describe("ConsoleEmailAdapter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs the recipient, subject and body to the console", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const adapter = new ConsoleEmailAdapter();

    await adapter.send({
      to: "someone@example.com",
      subject: "Reset your password",
      html: "<a href=\"https://example.com/reset/abc\">Reset link</a>",
    });

    const loggedOutput = logSpy.mock.calls.map((call) => call.join(" ")).join("\n");
    expect(loggedOutput).toContain("someone@example.com");
    expect(loggedOutput).toContain("Reset your password");
    expect(loggedOutput).toContain("https://example.com/reset/abc");
  });
});
