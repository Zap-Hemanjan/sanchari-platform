import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const testimonialInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  quote: z.string().trim().min(1, "Quote is required"),
  imageUrl: z.string().url().nullish(),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const testimonialUpdateSchema = testimonialInputSchema.partial();

export async function listTestimonials(
  options: { publishedOnly?: boolean } = {},
) {
  return prisma.testimonial.findMany({
    where: options.publishedOnly ? { published: true } : undefined,
    orderBy: { order: "asc" },
  });
}

export async function createTestimonial(
  input: z.input<typeof testimonialInputSchema>,
) {
  const data = testimonialInputSchema.parse(input);
  return prisma.testimonial.create({ data });
}

export async function updateTestimonial(
  id: string,
  input: z.input<typeof testimonialUpdateSchema>,
) {
  const data = testimonialUpdateSchema.parse(input);
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}
