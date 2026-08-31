import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import {
  createInquiry,
  listInquiries,
  markInquiryStatus,
} from "@/lib/content/inquiries";

describe("inquiry content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates an inquiry with status 'new' by default", async () => {
    const inquiry = await createInquiry({
      name: "Priya",
      email: "priya@example.com",
      message: "Interested in the Kerala temple circuit.",
    });

    expect(inquiry.status).toBe("new");
  });

  it("rejects an invalid email", async () => {
    await expect(
      createInquiry({
        name: "Priya",
        email: "not-an-email",
        message: "Hello.",
      }),
    ).rejects.toThrow();
  });

  it("lists inquiries newest first", async () => {
    await createInquiry({ name: "First", email: "a@example.com", message: "Hi." });
    await createInquiry({ name: "Second", email: "b@example.com", message: "Hi." });

    const inquiries = await listInquiries();
    expect(inquiries.map((i) => i.name)).toEqual(["Second", "First"]);
  });

  it("updates an inquiry's status to a valid value", async () => {
    const inquiry = await createInquiry({
      name: "Priya",
      email: "priya@example.com",
      message: "Hello.",
    });

    const updated = await markInquiryStatus(inquiry.id, "read");
    expect(updated.status).toBe("read");
  });

  it("rejects an invalid status value", async () => {
    const inquiry = await createInquiry({
      name: "Priya",
      email: "priya@example.com",
      message: "Hello.",
    });

    await expect(
      markInquiryStatus(inquiry.id, "not-a-real-status"),
    ).rejects.toThrow();
  });

  it("stores optional package context fields when submitted from a package page", async () => {
    const inquiry = await createInquiry({
      name: "Priya",
      email: "priya@example.com",
      message: "Interested.",
      packageTitle: "Tamil Nadu Temple Journey",
      adults: 2,
      children: 1,
      country: "United States",
    });

    expect(inquiry.packageTitle).toBe("Tamil Nadu Temple Journey");
    expect(inquiry.adults).toBe(2);
    expect(inquiry.children).toBe(1);
    expect(inquiry.country).toBe("United States");
  });
});
