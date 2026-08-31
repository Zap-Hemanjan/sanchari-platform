import { Resend } from "resend";
import type { EmailAdapter, SendEmailInput } from "@/lib/email/email-adapter";

const DEFAULT_FROM = "Sanchari <no-reply@sanchari.travel>";

export class ResendEmailAdapter implements EmailAdapter {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send({ to, subject, html }: SendEmailInput): Promise<void> {
    const { error } = await this.client.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
