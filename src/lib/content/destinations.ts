import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const destinationInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  location: z.string().trim().min(1, "Location is required"),
  imageUrl: z.string().url().nullish(),
  order: z.number().int().default(0),
});

export const destinationUpdateSchema = destinationInputSchema.partial();

export async function listDestinations() {
  return prisma.destination.findMany({ orderBy: { order: "asc" } });
}

export async function createDestination(input: z.input<typeof destinationInputSchema>) {
  const data = destinationInputSchema.parse(input);
  return prisma.destination.create({ data });
}

export async function updateDestination(
  id: string,
  input: z.input<typeof destinationUpdateSchema>,
) {
  const data = destinationUpdateSchema.parse(input);
  return prisma.destination.update({ where: { id }, data });
}

export async function deleteDestination(id: string) {
  return prisma.destination.delete({ where: { id } });
}
