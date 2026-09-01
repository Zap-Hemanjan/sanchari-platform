// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import { resetDb } from "../helpers/db";
import HomePage from "@/app/(marketing)/page";

describe("public homepage", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("renders the current hero, categories and published testimonials from the database", async () => {
    await prisma.siteSettings.create({
      data: {
        id: "singleton",
        heroHeadline: "Discover the Soul of South India",
        heroSubheadline: "Temples, adventure and wellness await.",
      },
    });
    await prisma.category.create({
      data: { title: "Temple Tourism", description: "Pilgrimage circuits.", order: 0 },
    });
    await prisma.testimonial.create({
      data: { name: "Priya", quote: "Unforgettable trip!", published: true, order: 0 },
    });
    await prisma.testimonial.create({
      data: { name: "Hidden", quote: "Not visible.", published: false, order: 1 },
    });

    const ui = await HomePage();
    render(ui);

    expect(screen.getByText("Discover the Soul of South India")).toBeInTheDocument();
    expect(screen.getByText("Temple Tourism")).toBeInTheDocument();
    expect(screen.getByText(/Unforgettable trip!/)).toBeInTheDocument();
    expect(screen.queryByText(/Not visible\./)).not.toBeInTheDocument();
  });

  it("renders sensible fallback content before any admin content exists", async () => {
    const ui = await HomePage();
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
