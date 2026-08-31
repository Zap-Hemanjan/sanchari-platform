import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { createPackage } from "@/lib/content/packages";
import {
  GET as listPackagesRoute,
  POST as createPackageRoute,
} from "@/app/api/admin/packages/route";
import {
  PATCH as updatePackageRoute,
  DELETE as deletePackageRoute,
} from "@/app/api/admin/packages/[id]/route";

function jsonRequest(url: string, method: string, body?: unknown, cookieHeader?: string) {
  return new NextRequest(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

const SAMPLE = {
  slug: "sacred-kerala",
  title: "Sacred Kerala",
  duration: "7 Days",
  destination: "Kerala",
  description: "A journey through Kerala's sacred sites.",
  highlights: ["Guruvayur", "Sree Padmanabhaswamy"],
  inclusions: ["Hotel", "Meals"],
  itinerary: [
    { dayNumber: 1, title: "Arrival", summary: "Fly in.", details: "Transfer to hotel." },
  ],
};

describe("/api/admin/packages", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await listPackagesRoute(
      jsonRequest("http://localhost/api/admin/packages", "GET"),
    );
    expect(response.status).toBe(401);
  });

  it("creates and lists packages with nested itinerary for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const createResponse = await createPackageRoute(
      jsonRequest("http://localhost/api/admin/packages", "POST", SAMPLE, cookieHeader),
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created.itineraryDays).toHaveLength(1);

    const listResponse = await listPackagesRoute(
      jsonRequest("http://localhost/api/admin/packages", "GET", undefined, cookieHeader),
    );
    expect(await listResponse.json()).toHaveLength(1);
  });

  it("updates (replacing itinerary) and deletes a package", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const created = await createPackage(SAMPLE);

    const updateResponse = await updatePackageRoute(
      jsonRequest(
        `http://localhost/api/admin/packages/${created.id}`,
        "PATCH",
        { itinerary: [{ dayNumber: 1, title: "New Day", summary: "S", details: "D" }] },
        cookieHeader,
      ),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.itineraryDays).toHaveLength(1);
    expect(updated.itineraryDays[0].title).toBe("New Day");

    const deleteResponse = await deletePackageRoute(
      jsonRequest(`http://localhost/api/admin/packages/${created.id}`, "DELETE", undefined, cookieHeader),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(deleteResponse.status).toBe(200);
  });
});
