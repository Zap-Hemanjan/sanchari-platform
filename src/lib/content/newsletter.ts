import { z } from "zod";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().trim().email("A valid email is required");

export async function subscribeToNewsletter(email: string) {
  const validEmail = emailSchema.parse(email);
  return prisma.newsletterSubscriber.upsert({
    where: { email: validEmail },
    update: {},
    create: { email: validEmail },
  });
}

export async function listNewsletterSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
}
