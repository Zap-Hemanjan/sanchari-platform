import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import { subscribeToNewsletter, listNewsletterSubscribers } from "@/lib/content/newsletter";

describe("newsletter content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("subscribes an email and lists it", async () => {
    await subscribeToNewsletter("someone@example.com");
    const subscribers = await listNewsletterSubscribers();
    expect(subscribers.map((s) => s.email)).toEqual(["someone@example.com"]);
  });

  it("rejects an invalid email", async () => {
    await expect(subscribeToNewsletter("not-an-email")).rejects.toThrow();
  });

  it("is idempotent for a duplicate subscription instead of throwing", async () => {
    await subscribeToNewsletter("someone@example.com");
    await subscribeToNewsletter("someone@example.com");

    const subscribers = await listNewsletterSubscribers();
    expect(subscribers).toHaveLength(1);
  });
});
