import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import { updateHero, updateSettings, getSiteSettings } from "@/lib/content/hero";

describe("site settings (stats + contact) repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("updates stats and contact fields without touching hero content", async () => {
    await updateHero({ heroHeadline: "Headline", heroSubheadline: "Sub." });

    await updateSettings({
      statsYears: 5,
      statsTravelers: 25000,
      statsDestinations: 40,
      statsSatisfaction: 98,
      contactPhone: "+91 7337428436",
      contactEmail: "info@sanchari.travel",
      contactLocation: "Hyderabad, India",
      contactHours: "Mon - Fri: 08.00 - 20.00",
    });

    const settings = await getSiteSettings();
    expect(settings?.heroHeadline).toBe("Headline");
    expect(settings?.statsTravelers).toBe(25000);
    expect(settings?.contactPhone).toBe("+91 7337428436");
  });

  it("rejects a negative stat", async () => {
    await updateHero({ heroHeadline: "Headline", heroSubheadline: "Sub." });
    await expect(updateSettings({ statsYears: -1 })).rejects.toThrow();
  });
});
