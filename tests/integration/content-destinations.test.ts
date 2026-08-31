import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  listDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/lib/content/destinations";

describe("destination content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates and lists destinations ordered", async () => {
    await createDestination({ name: "Bhadrachalam", location: "Telangana", order: 1 });
    await createDestination({ name: "Yadadri", location: "Telangana", order: 0 });

    const destinations = await listDestinations();
    expect(destinations.map((d) => d.name)).toEqual(["Yadadri", "Bhadrachalam"]);
  });

  it("rejects an empty name", async () => {
    await expect(createDestination({ name: "", location: "Telangana" })).rejects.toThrow();
  });

  it("updates and deletes a destination", async () => {
    const created = await createDestination({ name: "Basara", location: "Telangana" });
    const updated = await updateDestination(created.id, { location: "Updated" });
    expect(updated.location).toBe("Updated");

    await deleteDestination(created.id);
    expect(await listDestinations()).toHaveLength(0);
  });
});
