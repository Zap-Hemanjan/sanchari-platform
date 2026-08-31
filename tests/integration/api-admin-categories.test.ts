import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { resetDb } from "../helpers/db";
import { createAuthenticatedAdmin } from "../helpers/auth";
import { createCategory } from "@/lib/content/categories";
import {
  GET as listCategoriesRoute,
  POST as createCategoryRoute,
} from "@/app/api/admin/categories/route";
import {
  PATCH as updateCategoryRoute,
  DELETE as deleteCategoryRoute,
} from "@/app/api/admin/categories/[id]/route";

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

describe("/api/admin/categories", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("rejects unauthenticated list and create requests", async () => {
    const listResponse = await listCategoriesRoute(
      jsonRequest("http://localhost/api/admin/categories", "GET"),
    );
    expect(listResponse.status).toBe(401);

    const createResponse = await createCategoryRoute(
      jsonRequest("http://localhost/api/admin/categories", "POST", {
        title: "X",
        description: "Y",
      }),
    );
    expect(createResponse.status).toBe(401);
  });

  it("creates and lists categories for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();

    const createResponse = await createCategoryRoute(
      jsonRequest(
        "http://localhost/api/admin/categories",
        "POST",
        { title: "Temple Tourism", description: "Pilgrimage circuits." },
        cookieHeader,
      ),
    );
    expect(createResponse.status).toBe(201);

    const listResponse = await listCategoriesRoute(
      jsonRequest("http://localhost/api/admin/categories", "GET", undefined, cookieHeader),
    );
    const categories = await listResponse.json();
    expect(categories).toHaveLength(1);
    expect(categories[0].title).toBe("Temple Tourism");
  });

  it("updates and deletes a category for an authenticated admin", async () => {
    const { cookieHeader } = await createAuthenticatedAdmin();
    const category = await createCategory({ title: "Adventure", description: "Trekking." });

    const updateResponse = await updateCategoryRoute(
      jsonRequest(
        `http://localhost/api/admin/categories/${category.id}`,
        "PATCH",
        { description: "Updated description." },
        cookieHeader,
      ),
      { params: Promise.resolve({ id: category.id }) },
    );
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await deleteCategoryRoute(
      jsonRequest(
        `http://localhost/api/admin/categories/${category.id}`,
        "DELETE",
        undefined,
        cookieHeader,
      ),
      { params: Promise.resolve({ id: category.id }) },
    );
    expect(deleteResponse.status).toBe(200);
  });
});
