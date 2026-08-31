import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { GET as listRoute, POST as createRoute } from "@/app/api/admin/destinations/route";
import { PATCH as updateRoute, DELETE as deleteRoute } from "@/app/api/admin/destinations/[id]/route";

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

describe("/api/admin/destinations", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await listRoute(jsonRequest("http://localhost/api/admin/destinations", "GET"));
    expect(response.status).toBe(401);
  });

  it("creates, lists, updates and deletes a destination", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const createResponse = await createRoute(
      jsonRequest(
        "http://localhost/api/admin/destinations",
        "POST",
        { name: "Yadadri", location: "Telangana" },
        cookieHeader,
      ),
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const listResponse = await listRoute(
      jsonRequest("http://localhost/api/admin/destinations", "GET", undefined, cookieHeader),
    );
    expect(await listResponse.json()).toHaveLength(1);

    const updateResponse = await updateRoute(
      jsonRequest(
        `http://localhost/api/admin/destinations/${created.id}`,
        "PATCH",
        { location: "Updated" },
        cookieHeader,
      ),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await deleteRoute(
      jsonRequest(`http://localhost/api/admin/destinations/${created.id}`, "DELETE", undefined, cookieHeader),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(deleteResponse.status).toBe(200);
  });
});
