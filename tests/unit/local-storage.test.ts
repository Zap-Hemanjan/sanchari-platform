import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { LocalStorageAdapter } from "@/lib/storage/local-storage";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "sanchari-uploads-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("LocalStorageAdapter", () => {
  it("writes the file to the uploads directory and returns a matching url", async () => {
    const adapter = new LocalStorageAdapter({ uploadsDir: dir });
    const buffer = Buffer.from("fake-image-bytes");

    const result = await adapter.upload({ buffer, mimeType: "image/png" });

    expect(result.url).toMatch(/^\/uploads\/.+\.png$/);

    const files = await readdir(dir);
    expect(files).toHaveLength(1);
    const written = await readFile(path.join(dir, files[0]));
    expect(written.equals(buffer)).toBe(true);
  });

  it("gives each upload a unique filename", async () => {
    const adapter = new LocalStorageAdapter({ uploadsDir: dir });
    const buffer = Buffer.from("same-content");

    const first = await adapter.upload({ buffer, mimeType: "image/jpeg" });
    const second = await adapter.upload({ buffer, mimeType: "image/jpeg" });

    expect(first.url).not.toBe(second.url);
  });
});
