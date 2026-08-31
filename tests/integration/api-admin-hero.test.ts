import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { PUT as updateHeroRoute } from "@/app/api/admin/hero/route";

function request(body: unknown, cookieHeader?: string) {
  return new NextRequest("http://localhost/api/admin/hero", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("PUT /api/admin/hero", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects an unauthenticated request", async () => {
    const response = await updateHeroRoute(
      request({ heroHeadline: "X", heroSubheadline: "Y" }),
    );
    expect(response.status).toBe(401);
  });

  it("updates hero content for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const response = await updateHeroRoute(
      request(
        { heroHeadline: "New headline", heroSubheadline: "New sub." },
        cookieHeader,
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.heroHeadline).toBe("New headline");
  });
});
