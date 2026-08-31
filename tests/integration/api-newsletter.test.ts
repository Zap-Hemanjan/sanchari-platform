import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { POST as subscribeRoute } from "@/app/api/newsletter/route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("subscribes an email with no authentication required", async () => {
    const response = await subscribeRoute(request({ email: "someone@example.com" }));
    expect(response.status).toBe(200);
  });

  it("rejects an invalid email", async () => {
    const response = await subscribeRoute(request({ email: "not-an-email" }));
    expect(response.status).toBe(400);
  });
});
