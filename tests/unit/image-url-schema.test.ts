import { describe, it, expect } from "vitest";
import { imageUrlSchema } from "@/lib/content/image-url";

describe("imageUrlSchema", () => {
  it("accepts an absolute https URL (Cloudinary in production)", () => {
    expect(imageUrlSchema.parse("https://res.cloudinary.com/demo/image.webp")).toBe(
      "https://res.cloudinary.com/demo/image.webp",
    );
  });

  it("accepts a root-relative upload path (local storage in dev)", () => {
    expect(imageUrlSchema.parse("/uploads/some-file.webp")).toBe(
      "/uploads/some-file.webp",
    );
  });

  it("rejects a string that is neither an absolute URL nor a root-relative path", () => {
    expect(() => imageUrlSchema.parse("not-a-url")).toThrow();
  });
});
