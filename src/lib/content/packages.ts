import { z } from "zod";
import { prisma } from "@/lib/prisma";

const itineraryDayInputSchema = z.object({
  dayNumber: z.number().int(),
  title: z.string().trim().min(1, "Day title is required"),
  summary: z.string().trim().min(1, "Day summary is required"),
  details: z.string().trim().min(1, "Day details are required"),
});

export const packageInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  title: z.string().trim().min(1, "Title is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  destination: z.string().trim().min(1, "Destination is required"),
  heroImageUrl: z.string().url().nullish(),
  description: z.string().trim().min(1, "Description is required"),
  categoryId: z.string().trim().min(1).nullish(),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  highlights: z.array(z.string().trim().min(1)).default([]),
  inclusions: z.array(z.string().trim().min(1)).default([]),
  itinerary: z.array(itineraryDayInputSchema).default([]),
});

export const packageUpdateSchema = packageInputSchema.partial();

const PACKAGE_INCLUDE = {
  itineraryDays: { orderBy: { order: "asc" as const } },
  highlights: { orderBy: { order: "asc" as const } },
  inclusions: { orderBy: { order: "asc" as const } },
  category: true,
};

function toNestedCreate(
  input: Pick<z.infer<typeof packageInputSchema>, "highlights" | "inclusions" | "itinerary">,
) {
  return {
    highlights: {
      create: input.highlights.map((text, order) => ({ text, order })),
    },
    inclusions: {
      create: input.inclusions.map((text, order) => ({ text, order })),
    },
    itineraryDays: {
      create: input.itinerary.map((day, order) => ({ ...day, order })),
    },
  };
}

export async function listPackages(
  options: { publishedOnly?: boolean; categoryId?: string } = {},
) {
  return prisma.package.findMany({
    where: {
      ...(options.publishedOnly ? { published: true } : {}),
      ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    },
    include: { category: true },
    orderBy: { order: "asc" },
  });
}

export async function getPackageBySlug(slug: string) {
  return prisma.package.findUnique({ where: { slug }, include: PACKAGE_INCLUDE });
}

export async function getPackageById(id: string) {
  return prisma.package.findUnique({ where: { id }, include: PACKAGE_INCLUDE });
}

export async function createPackage(input: z.input<typeof packageInputSchema>) {
  const data = packageInputSchema.parse(input);
  const { highlights, inclusions, itinerary, ...scalars } = data;

  return prisma.package.create({
    data: {
      ...scalars,
      ...toNestedCreate({ highlights, inclusions, itinerary }),
    },
    include: PACKAGE_INCLUDE,
  });
}

export async function updatePackage(
  id: string,
  input: z.input<typeof packageUpdateSchema>,
) {
  const data = packageUpdateSchema.parse(input);
  const { highlights, inclusions, itinerary, ...scalars } = data;

  return prisma.$transaction(async (tx) => {
    if (highlights) {
      await tx.packageHighlight.deleteMany({ where: { packageId: id } });
    }
    if (inclusions) {
      await tx.packageInclusion.deleteMany({ where: { packageId: id } });
    }
    if (itinerary) {
      await tx.itineraryDay.deleteMany({ where: { packageId: id } });
    }

    return tx.package.update({
      where: { id },
      data: {
        ...scalars,
        ...(highlights && {
          highlights: { create: highlights.map((text, order) => ({ text, order })) },
        }),
        ...(inclusions && {
          inclusions: { create: inclusions.map((text, order) => ({ text, order })) },
        }),
        ...(itinerary && {
          itineraryDays: { create: itinerary.map((day, order) => ({ ...day, order })) },
        }),
      },
      include: PACKAGE_INCLUDE,
    });
  });
}

export async function deletePackage(id: string) {
  return prisma.package.delete({ where: { id } });
}
