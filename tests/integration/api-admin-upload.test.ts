import { describe, it, expect, beforeEach, afterEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { POST as uploadRoute } from "@/app/api/admin/upload/route";

let dir: string;

beforeEach(async () => {
  await resetDb();
  dir = await mkdtemp(path.join(tmpdir(), "sanchari-upload-route-"));
  process.env.LOCAL_UPLOADS_DIR = dir;
  delete process.env.CLOUDINARY_URL;
});

afterEach(async () => {
  delete process.env.LOCAL_UPLOADS_DIR;
  await rm(dir, { recursive: true, force: true });
});

afterAll(resetDb);

function formDataRequest(formData: FormData, cookieHeader?: string) {
  return new NextRequest("http://localhost/api/admin/upload", {
    method: "POST",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    body: formData,
  });
}

describe("POST /api/admin/upload", () => {
  it("rejects an unauthenticated request", async () => {
    const formData = new FormData();
    formData.set("file", new File(["fake-bytes"], "photo.png", { type: "image/png" }));

    const response = await uploadRoute(formDataRequest(formData));
    expect(response.status).toBe(401);
  });

  it("stores a valid image and returns its url", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const formData = new FormData();
    formData.set("file", new File(["fake-bytes"], "photo.png", { type: "image/png" }));

    const response = await uploadRoute(formDataRequest(formData, cookieHeader));

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.url).toMatch(/^\/uploads\/.+\.png$/);

    const files = await readdir(dir);
    expect(files).toHaveLength(1);
  });

  it("rejects a disallowed file type", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const formData = new FormData();
    formData.set(
      "file",
      new File(["fake-bytes"], "doc.pdf", { type: "application/pdf" }),
    );

    const response = await uploadRoute(formDataRequest(formData, cookieHeader));
    expect(response.status).toBe(400);
  });

  it("rejects a missing file", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const response = await uploadRoute(formDataRequest(new FormData(), cookieHeader));
    expect(response.status).toBe(400);
  });
});
