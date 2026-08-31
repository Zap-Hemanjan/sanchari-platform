import type { EmailAdapter, SendEmailInput } from "@/lib/email/email-adapter";

// Dev-mode adapter: no email provider account required to exercise the full
// password-reset flow locally.
export class ConsoleEmailAdapter implements EmailAdapter {
  async send({ to, subject, html }: SendEmailInput): Promise<void> {
    console.log(
      [
        "----- [dev email] -----",
        `To: ${to}`,
        `Subject: ${subject}`,
        html,
        "------------------------",
      ].join("\n"),
    );
  }
}
