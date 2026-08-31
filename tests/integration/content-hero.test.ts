import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import { getSiteSettings, updateHero } from "@/lib/content/hero";

describe("hero content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("returns null before any hero content has been set", async () => {
    await expect(getSiteSettings()).resolves.toBeNull();
  });

  it("creates the singleton settings row on first update", async () => {
    const result = await updateHero({
      heroHeadline: "Discover the Soul of South India",
      heroSubheadline: "Temples, adventure and wellness.",
    });

    expect(result.heroHeadline).toBe("Discover the Soul of South India");
    await expect(getSiteSettings()).resolves.toMatchObject({
      heroHeadline: "Discover the Soul of South India",
    });
  });

  it("updates the same singleton row on subsequent calls, not a new one", async () => {
    await updateHero({
      heroHeadline: "First headline",
      heroSubheadline: "First sub.",
    });
    await updateHero({
      heroHeadline: "Second headline",
      heroSubheadline: "Second sub.",
    });

    const settings = await getSiteSettings();
    expect(settings?.heroHeadline).toBe("Second headline");
  });

  it("rejects an empty headline", async () => {
    await expect(
      updateHero({ heroHeadline: "", heroSubheadline: "Sub." }),
    ).rejects.toThrow();
  });
});
