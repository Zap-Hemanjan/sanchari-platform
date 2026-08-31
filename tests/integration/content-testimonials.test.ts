import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/content/testimonials";

describe("testimonial content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("lists only published testimonials by default, ordered", async () => {
    await createTestimonial({ name: "B", quote: "Great!", order: 1 });
    await createTestimonial({ name: "A", quote: "Amazing!", order: 0 });
    await createTestimonial({
      name: "Hidden",
      quote: "Not ready.",
      order: 2,
      published: false,
    });

    const testimonials = await listTestimonials({ publishedOnly: true });

    expect(testimonials.map((t) => t.name)).toEqual(["A", "B"]);
  });

  it("lists all testimonials, including unpublished, for the admin view", async () => {
    await createTestimonial({ name: "A", quote: "Amazing!" });
    await createTestimonial({ name: "Hidden", quote: "Not ready.", published: false });

    const testimonials = await listTestimonials({ publishedOnly: false });

    expect(testimonials).toHaveLength(2);
  });

  it("rejects an empty quote", async () => {
    await expect(
      createTestimonial({ name: "Someone", quote: "" }),
    ).rejects.toThrow();
  });

  it("updates and deletes a testimonial", async () => {
    const created = await createTestimonial({ name: "A", quote: "Original." });

    const updated = await updateTestimonial(created.id, { quote: "Edited." });
    expect(updated.quote).toBe("Edited.");

    await deleteTestimonial(created.id);
    const remaining = await listTestimonials({ publishedOnly: false });
    expect(remaining).toHaveLength(0);
  });
});
