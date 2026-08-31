import { z } from "zod";
import { prisma } from "@/lib/prisma";

const INQUIRY_STATUSES = ["new", "read", "archived"] as const;

export const inquiryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  message: z.string().trim().min(1, "Message is required"),
  // Populated only when submitted from a package detail page's enquiry form.
  packageTitle: z.string().trim().min(1).nullish(),
  adults: z.number().int().nonnegative().nullish(),
  children: z.number().int().nonnegative().nullish(),
  country: z.string().trim().min(1).nullish(),
});

export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);

export async function createInquiry(
  input: z.input<typeof inquiryInputSchema>,
) {
  const data = inquiryInputSchema.parse(input);
  return prisma.inquiry.create({ data });
}

export async function listInquiries() {
  return prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markInquiryStatus(id: string, status: string) {
  const validStatus = inquiryStatusSchema.parse(status);
  return prisma.inquiry.update({
    where: { id },
    data: { status: validStatus },
  });
}
