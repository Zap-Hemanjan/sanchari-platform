import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import {
  GET as listTestimonialsRoute,
  POST as createTestimonialRoute,
} from "@/app/api/admin/testimonials/route";
import {
  PATCH as updateTestimonialRoute,
  DELETE as deleteTestimonialRoute,
} from "@/app/api/admin/testimonials/[id]/route";

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

describe("/api/admin/testimonials", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await listTestimonialsRoute(
      jsonRequest("http://localhost/api/admin/testimonials", "GET"),
    );
    expect(response.status).toBe(401);
  });

  it("creates, lists, updates and deletes a testimonial for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const createResponse = await createTestimonialRoute(
      jsonRequest(
        "http://localhost/api/admin/testimonials",
        "POST",
        { name: "Priya", quote: "Wonderful trip!" },
        cookieHeader,
      ),
    );
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();

    const listResponse = await listTestimonialsRoute(
      jsonRequest("http://localhost/api/admin/testimonials", "GET", undefined, cookieHeader),
    );
    expect(await listResponse.json()).toHaveLength(1);

    const updateResponse = await updateTestimonialRoute(
      jsonRequest(
        `http://localhost/api/admin/testimonials/${created.id}`,
        "PATCH",
        { quote: "Updated quote." },
        cookieHeader,
      ),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await deleteTestimonialRoute(
      jsonRequest(
        `http://localhost/api/admin/testimonials/${created.id}`,
        "DELETE",
        undefined,
        cookieHeader,
      ),
      { params: Promise.resolve({ id: created.id }) },
    );
    expect(deleteResponse.status).toBe(200);
  });
});
