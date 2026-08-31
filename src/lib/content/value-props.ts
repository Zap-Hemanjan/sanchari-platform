import { z } from "zod";
import { prisma } from "@/lib/prisma";

const VALUE_PROP_SECTIONS = ["sanchari_way", "process"] as const;

export const valuePropInputSchema = z.object({
  section: z.enum(VALUE_PROP_SECTIONS),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  order: z.number().int().default(0),
});

export const valuePropUpdateSchema = valuePropInputSchema.partial();

export async function listValueProps(section: (typeof VALUE_PROP_SECTIONS)[number]) {
  return prisma.valueProp.findMany({ where: { section }, orderBy: { order: "asc" } });
}

export async function createValueProp(input: z.input<typeof valuePropInputSchema>) {
  const data = valuePropInputSchema.parse(input);
  return prisma.valueProp.create({ data });
}

export async function updateValueProp(
  id: string,
  input: z.input<typeof valuePropUpdateSchema>,
) {
  const data = valuePropUpdateSchema.parse(input);
  return prisma.valueProp.update({ where: { id }, data });
}

export async function deleteValueProp(id: string) {
  return prisma.valueProp.delete({ where: { id } });
}
