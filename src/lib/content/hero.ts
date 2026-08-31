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

export const settingsInputSchema = z.object({
  statsYears: z.number().int().nonnegative().nullish(),
  statsTravelers: z.number().int().nonnegative().nullish(),
  statsDestinations: z.number().int().nonnegative().nullish(),
  statsSatisfaction: z.number().int().min(0).max(100).nullish(),
  contactPhone: z.string().trim().min(1).nullish(),
  contactEmail: z.string().trim().email().nullish(),
  contactLocation: z.string().trim().min(1).nullish(),
  contactHours: z.string().trim().min(1).nullish(),
});

// Assumes updateHero has already created the singleton row (hero content is
// required first); this only ever updates the stats/contact subset.
export async function updateSettings(input: z.input<typeof settingsInputSchema>) {
  const data = settingsInputSchema.parse(input);
  return prisma.siteSettings.update({ where: { id: SINGLETON_ID }, data });
}
