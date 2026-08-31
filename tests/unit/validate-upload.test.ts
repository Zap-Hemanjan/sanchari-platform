import { describe, it, expect } from "vitest";
import { validateUpload, MAX_UPLOAD_BYTES } from "@/lib/storage/validate-upload";

describe("validateUpload", () => {
  it.each(["image/jpeg", "image/png", "image/webp", "image/gif"])(
    "accepts a small %s file",
    (type) => {
      const result = validateUpload({ type, size: 1024 });
      expect(result.valid).toBe(true);
    },
  );

  it("rejects a disallowed mime type", () => {
    const result = validateUpload({
      type: "application/pdf",
      size: 1024,
    });
    expect(result.valid).toBe(false);
  });

  it("rejects an svg (script-injection risk in inline SVG)", () => {
    const result = validateUpload({
      type: "image/svg+xml",
      size: 1024,
    });
    expect(result.valid).toBe(false);
  });

  it("rejects a file over the size limit", () => {
    const result = validateUpload({
      type: "image/png",
      size: MAX_UPLOAD_BYTES + 1,
    });
    expect(result.valid).toBe(false);
  });

  it("accepts a file exactly at the size limit", () => {
    const result = validateUpload({
      type: "image/png",
      size: MAX_UPLOAD_BYTES,
    });
    expect(result.valid).toBe(true);
  });
});
