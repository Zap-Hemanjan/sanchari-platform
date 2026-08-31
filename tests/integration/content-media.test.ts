import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import { listMedia, createMedia, deleteMedia } from "@/lib/content/media";

describe("media content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates and lists media ordered by their `order` field", async () => {
    await createMedia({ url: "/uploads/b.png", altText: "B", order: 1 });
    await createMedia({ url: "/uploads/a.png", altText: "A", order: 0 });

    const media = await listMedia();
    expect(media.map((m) => m.altText)).toEqual(["A", "B"]);
  });

  it("rejects an empty url", async () => {
    await expect(createMedia({ url: "", altText: "X" })).rejects.toThrow();
  });

  it("deletes a media item", async () => {
    const created = await createMedia({ url: "/uploads/a.png", altText: "A" });
    await deleteMedia(created.id);
    const media = await listMedia();
    expect(media).toHaveLength(0);
  });
});
