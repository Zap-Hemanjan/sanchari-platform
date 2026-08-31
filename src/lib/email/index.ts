import type { EmailAdapter } from "@/lib/email/email-adapter";
import { ConsoleEmailAdapter } from "@/lib/email/console-email";
import { ResendEmailAdapter } from "@/lib/email/resend-email";

export function getEmailAdapter(): EmailAdapter {
  return process.env.RESEND_API_KEY
    ? new ResendEmailAdapter(process.env.RESEND_API_KEY)
    : new ConsoleEmailAdapter();
}

export type { EmailAdapter, SendEmailInput } from "@/lib/email/email-adapter";
