import { describe, it, expect, afterEach } from "vitest";
import { getStorageAdapter } from "@/lib/storage";
import { LocalStorageAdapter } from "@/lib/storage/local-storage";
import { CloudinaryStorageAdapter } from "@/lib/storage/cloudinary-storage";

const originalUrl = process.env.CLOUDINARY_URL;

afterEach(() => {
  if (originalUrl === undefined) {
    delete process.env.CLOUDINARY_URL;
  } else {
    process.env.CLOUDINARY_URL = originalUrl;
  }
});

describe("getStorageAdapter", () => {
  it("returns LocalStorageAdapter when CLOUDINARY_URL is unset", () => {
    delete process.env.CLOUDINARY_URL;
    expect(getStorageAdapter()).toBeInstanceOf(LocalStorageAdapter);
  });

  it("returns CloudinaryStorageAdapter when CLOUDINARY_URL is set", () => {
    process.env.CLOUDINARY_URL = "cloudinary://key:secret@cloud";
    expect(getStorageAdapter()).toBeInstanceOf(CloudinaryStorageAdapter);
  });
});
