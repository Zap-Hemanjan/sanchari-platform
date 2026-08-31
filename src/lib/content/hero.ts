import { z } from "zod";
import { prisma } from "@/lib/prisma";

const SINGLETON_ID = "singleton";

export const heroInputSchema = z.object({
  heroHeadline: z.string().trim().min(1, "Headline is required"),
  heroSubheadline: z.string().trim().min(1, "Subheadline is required"),
  heroImageUrl: z.string().url().nullish(),
});

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
}

export async function updateHero(input: z.input<typeof heroInputSchema>) {
  const data = heroInputSchema.parse(input);
  return prisma.siteSettings.upsert({
    where: { id: SINGLETON_ID },
    update: data,
    create: { id: SINGLETON_ID, ...data },
  });
}
