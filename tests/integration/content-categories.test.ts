import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/content/categories";

describe("category content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates and lists categories ordered by their `order` field", async () => {
    await createCategory({ title: "Wellness", description: "Relax.", order: 2 });
    await createCategory({ title: "Temple Tourism", description: "Pilgrimage.", order: 0 });
    await createCategory({ title: "Adventure", description: "Trekking.", order: 1 });

    const categories = await listCategories();

    expect(categories.map((c) => c.title)).toEqual([
      "Temple Tourism",
      "Adventure",
      "Wellness",
    ]);
  });

  it("rejects creating a category with an empty title", async () => {
    await expect(
      createCategory({ title: "", description: "Something." }),
    ).rejects.toThrow();
  });

  it("updates a category's fields", async () => {
    const created = await createCategory({
      title: "Adventure",
      description: "Old description.",
    });

    const updated = await updateCategory(created.id, {
      description: "New description.",
    });

    expect(updated.description).toBe("New description.");
    expect(updated.title).toBe("Adventure");
  });

  it("deletes a category", async () => {
    const created = await createCategory({
      title: "Temporary",
      description: "Delete me.",
    });

    await deleteCategory(created.id);

    const categories = await listCategories();
    expect(categories.find((c) => c.id === created.id)).toBeUndefined();
  });
});
