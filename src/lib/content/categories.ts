import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { imageUrlSchema } from "@/lib/content/image-url";

export const categoryInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  imageUrl: imageUrlSchema.nullish(),
  order: z.number().int().default(0),
});

export const categoryUpdateSchema = categoryInputSchema.partial();

export function listCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function createCategory(
  input: z.input<typeof categoryInputSchema>,
) {
  const data = categoryInputSchema.parse(input);
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  input: z.input<typeof categoryUpdateSchema>,
) {
  const data = categoryUpdateSchema.parse(input);
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
