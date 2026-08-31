import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const faqInputSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  order: z.number().int().default(0),
});

export const faqUpdateSchema = faqInputSchema.partial();

export async function listFaqs() {
  return prisma.faq.findMany({ orderBy: { order: "asc" } });
}

export async function createFaq(input: z.input<typeof faqInputSchema>) {
  const data = faqInputSchema.parse(input);
  return prisma.faq.create({ data });
}

export async function updateFaq(id: string, input: z.input<typeof faqUpdateSchema>) {
  const data = faqUpdateSchema.parse(input);
  return prisma.faq.update({ where: { id }, data });
}

export async function deleteFaq(id: string) {
  return prisma.faq.delete({ where: { id } });
}
