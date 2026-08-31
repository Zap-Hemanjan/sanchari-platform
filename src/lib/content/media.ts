import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const mediaInputSchema = z.object({
  url: z.string().trim().min(1, "URL is required"),
  altText: z.string().trim().min(1, "Alt text is required"),
  order: z.number().int().default(0),
});

export async function listMedia() {
  return prisma.mediaAsset.findMany({ orderBy: { order: "asc" } });
}

export async function createMedia(input: z.input<typeof mediaInputSchema>) {
  const data = mediaInputSchema.parse(input);
  return prisma.mediaAsset.create({ data });
}

export async function deleteMedia(id: string) {
  return prisma.mediaAsset.delete({ where: { id } });
}
