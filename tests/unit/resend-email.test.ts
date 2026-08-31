import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

import { ResendEmailAdapter } from "@/lib/email/resend-email";

beforeEach(() => {
  sendMock.mockReset();
  process.env.RESEND_FROM_EMAIL = "Sanchari <no-reply@sanchari.travel>";
});

describe("ResendEmailAdapter", () => {
  it("sends via the Resend SDK with the configured from-address", async () => {
    sendMock.mockResolvedValue({ data: { id: "email-1" }, error: null });

    const adapter = new ResendEmailAdapter("fake-api-key");
    await adapter.send({
      to: "someone@example.com",
      subject: "Reset your password",
      html: "<p>reset link</p>",
    });

    expect(sendMock).toHaveBeenCalledWith({
      from: "Sanchari <no-reply@sanchari.travel>",
      to: "someone@example.com",
      subject: "Reset your password",
      html: "<p>reset link</p>",
    });
  });

  it("throws if Resend returns an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "invalid API key" },
    });

    const adapter = new ResendEmailAdapter("fake-api-key");
    await expect(
      adapter.send({
        to: "someone@example.com",
        subject: "Subject",
        html: "<p>body</p>",
      }),
    ).rejects.toThrow("invalid API key");
  });
});
