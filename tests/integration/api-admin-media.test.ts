import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { GET as listMediaRoute, POST as createMediaRoute } from "@/app/api/admin/media/route";
import { DELETE as deleteMediaRoute } from "@/app/api/admin/media/[id]/route";

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

describe("/api/admin/media", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await listMediaRoute(
      jsonRequest("http://localhost/api/admin/media", "GET"),
    );
    expect(response.status).toBe(401);
  });

  it("creates, lists and deletes media for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const createResponse = await createMediaRoute(
      jsonRequest(
        "http://localhost/api/admin/media",
        "POST",
        { url: "/uploads/a.png", altText: "Kerala backwaters" },
        cookieHeader,
      ),
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const listResponse = await listMediaRoute(
      jsonRequest("http://localhost/api/admin/media", "GET", undefined, cookieHeader),
    );
    expect(await listResponse.json()).toHaveLength(1);

    const deleteResponse = await deleteMediaRoute(
      jsonRequest(`http://localhost/api/admin/media/${created.id}`, "DELETE", undefined, cookieHeader),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(deleteResponse.status).toBe(200);
  });
});
