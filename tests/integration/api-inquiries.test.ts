import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { createInquiry } from "@/lib/content/inquiries";
import { POST as submitInquiry } from "@/app/api/inquiries/route";
import { GET as listInquiriesRoute } from "@/app/api/admin/inquiries/route";
import { PATCH as updateInquiryStatusRoute } from "@/app/api/admin/inquiries/[id]/route";

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

describe("public inquiry submission", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("accepts a public inquiry with no authentication", async () => {
    const response = await submitInquiry(
      jsonRequest("http://localhost/api/inquiries", "POST", {
        name: "Priya",
        email: "priya@example.com",
        message: "Interested in the temple circuit.",
      }),
    );
    expect(response.status).toBe(201);
  });

  it("rejects an invalid inquiry submission", async () => {
    const response = await submitInquiry(
      jsonRequest("http://localhost/api/inquiries", "POST", {
        name: "",
        email: "not-an-email",
        message: "",
      }),
    );
    expect(response.status).toBe(400);
  });
});

describe("/api/admin/inquiries", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects an unauthenticated list request", async () => {
    const response = await listInquiriesRoute(
      jsonRequest("http://localhost/api/admin/inquiries", "GET"),
    );
    expect(response.status).toBe(401);
  });

  it("lists inquiries and updates status for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const inquiry = await createInquiry({
      name: "Priya",
      email: "priya@example.com",
      message: "Hello.",
    });

    const listResponse = await listInquiriesRoute(
      jsonRequest("http://localhost/api/admin/inquiries", "GET", undefined, cookieHeader),
    );
    expect(await listResponse.json()).toHaveLength(1);

    const updateResponse = await updateInquiryStatusRoute(
      jsonRequest(
        `http://localhost/api/admin/inquiries/${inquiry.id}`,
        "PATCH",
        { status: "read" },
        cookieHeader,
      ),
      { params: Promise.resolve({ id: inquiry.id }) },
    );
    expect(updateResponse.status).toBe(200);
    expect((await updateResponse.json()).status).toBe("read");
  });
});
