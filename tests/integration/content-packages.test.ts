import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  listPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getPackageBySlug,
  getPackageById,
} from "@/lib/content/packages";

function samplePackage(overrides: Partial<Parameters<typeof createPackage>[0]> = {}) {
  return {
    slug: "tamil-nadu-temple-journey",
    title: "Tamil Nadu Temple Journey",
    duration: "7 Days",
    destination: "Tamil Nadu",
    description: "A journey through twelve divine abodes across Tamil Nadu.",
    highlights: ["Brihadeeswarar Temple", "Meenakshi Temple"],
    inclusions: ["Hotel", "Meals", "Flight"],
    itinerary: [
      { dayNumber: 1, title: "Arrival", summary: "Fly in and settle.", details: "Land, transfer, rest." },
      { dayNumber: 2, title: "Thanjavur", summary: "Visit Brihadeeswarar.", details: "Morning darshan, evening free." },
    ],
    ...overrides,
  };
}

describe("package content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates a package with nested highlights, inclusions and itinerary", async () => {
    const created = await createPackage(samplePackage());

    const full = await getPackageBySlug(created.slug);
    expect(full?.title).toBe("Tamil Nadu Temple Journey");
    expect(full?.highlights.map((h) => h.text)).toEqual([
      "Brihadeeswarar Temple",
      "Meenakshi Temple",
    ]);
    expect(full?.inclusions.map((i) => i.text)).toEqual(["Hotel", "Meals", "Flight"]);
    expect(full?.itineraryDays).toHaveLength(2);
    expect(full?.itineraryDays[0].title).toBe("Arrival");
  });

  it("rejects a duplicate slug", async () => {
    await createPackage(samplePackage());
    await expect(
      createPackage(samplePackage({ title: "Another Title" })),
    ).rejects.toThrow();
  });

  it("lists only published packages by default, ordered", async () => {
    await createPackage(samplePackage({ slug: "b", title: "B", order: 1 }));
    await createPackage(samplePackage({ slug: "a", title: "A", order: 0 }));
    await createPackage(samplePackage({ slug: "hidden", title: "Hidden", published: false, order: 2 }));

    const packages = await listPackages({ publishedOnly: true });
    expect(packages.map((p) => p.title)).toEqual(["A", "B"]);
  });

  it("replaces itinerary/highlights/inclusions entirely on update, not appending", async () => {
    const created = await createPackage(samplePackage());

    await updatePackage(created.id, {
      ...samplePackage(),
      highlights: ["New Highlight Only"],
      itinerary: [
        { dayNumber: 1, title: "Replaced Day", summary: "New.", details: "New details." },
      ],
    });

    const full = await getPackageBySlug(created.slug);
    expect(full?.highlights.map((h) => h.text)).toEqual(["New Highlight Only"]);
    expect(full?.itineraryDays).toHaveLength(1);
    expect(full?.itineraryDays[0].title).toBe("Replaced Day");
  });

  it("deletes a package and its nested rows via cascade", async () => {
    const created = await createPackage(samplePackage());
    await deletePackage(created.id);

    await expect(getPackageBySlug(created.slug)).resolves.toBeNull();
  });

  it("fetches a package by id with nested data, for admin editing", async () => {
    const created = await createPackage(samplePackage());
    const full = await getPackageById(created.id);
    expect(full?.slug).toBe("tamil-nadu-temple-journey");
    expect(full?.itineraryDays).toHaveLength(2);
  });

  it("rejects creating a package with an empty title", async () => {
    await expect(
      createPackage(samplePackage({ title: "" })),
    ).rejects.toThrow();
  });
});
