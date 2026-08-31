import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { subscribeToNewsletter } from "@/lib/content/newsletter";
import { updateHero } from "@/lib/content/hero";
import { GET as listNewsletterRoute } from "@/app/api/admin/newsletter/route";
import { PUT as updateSettingsRoute } from "@/app/api/admin/settings/route";

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

describe("/api/admin/newsletter", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await listNewsletterRoute(
      jsonRequest("http://localhost/api/admin/newsletter", "GET"),
    );
    expect(response.status).toBe(401);
  });

  it("lists subscribers for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    await subscribeToNewsletter("someone@example.com");

    const response = await listNewsletterRoute(
      jsonRequest("http://localhost/api/admin/newsletter", "GET", undefined, cookieHeader),
    );
    expect(await response.json()).toHaveLength(1);
  });
});

describe("/api/admin/settings", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated requests", async () => {
    const response = await updateSettingsRoute(
      jsonRequest("http://localhost/api/admin/settings", "PUT", { statsYears: 5 }),
    );
    expect(response.status).toBe(401);
  });

  it("updates stats/contact fields for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    await updateHero({ heroHeadline: "H", heroSubheadline: "S" });

    const response = await updateSettingsRoute(
      jsonRequest(
        "http://localhost/api/admin/settings",
        "PUT",
        { statsYears: 5, contactPhone: "+91 7337428436" },
        cookieHeader,
      ),
    );
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.statsYears).toBe(5);
    expect(updated.contactPhone).toBe("+91 7337428436");
  });
});
