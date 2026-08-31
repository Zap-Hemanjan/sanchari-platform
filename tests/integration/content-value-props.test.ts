import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  listValueProps,
  createValueProp,
  updateValueProp,
  deleteValueProp,
} from "@/lib/content/value-props";

describe("value prop content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("lists value props filtered by section, ordered", async () => {
    await createValueProp({ section: "process", title: "Step 1", description: "D1", order: 0 });
    await createValueProp({ section: "sanchari_way", title: "Curated", description: "D2", order: 0 });
    await createValueProp({ section: "process", title: "Step 2", description: "D3", order: 1 });

    const process = await listValueProps("process");
    expect(process.map((v) => v.title)).toEqual(["Step 1", "Step 2"]);

    const way = await listValueProps("sanchari_way");
    expect(way.map((v) => v.title)).toEqual(["Curated"]);
  });

  it("rejects an unknown section", async () => {
    // Cast bypasses the compile-time literal-union check — this simulates
    // malformed input arriving from an untyped HTTP request body.
    await expect(
      createValueProp({
        section: "not-a-real-section" as never,
        title: "X",
        description: "Y",
      }),
    ).rejects.toThrow();
  });

  it("updates and deletes a value prop", async () => {
    const created = await createValueProp({
      section: "process",
      title: "Step 1",
      description: "Original",
    });
    const updated = await updateValueProp(created.id, { description: "Edited" });
    expect(updated.description).toBe("Edited");

    await deleteValueProp(created.id);
    expect(await listValueProps("process")).toHaveLength(0);
  });
});
