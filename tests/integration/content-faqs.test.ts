import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDb } from "../helpers/db";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/content/faqs";

describe("faq content repository", () => {
  beforeEach(resetDb);
  afterAll(resetDb);

  it("creates and lists faqs ordered", async () => {
    await createFaq({ question: "Q2?", answer: "A2", order: 1 });
    await createFaq({ question: "Q1?", answer: "A1", order: 0 });

    const faqs = await listFaqs();
    expect(faqs.map((f) => f.question)).toEqual(["Q1?", "Q2?"]);
  });

  it("rejects an empty question", async () => {
    await expect(createFaq({ question: "", answer: "A" })).rejects.toThrow();
  });

  it("updates and deletes a faq", async () => {
    const created = await createFaq({ question: "Q?", answer: "Original" });
    const updated = await updateFaq(created.id, { answer: "Edited" });
    expect(updated.answer).toBe("Edited");

    await deleteFaq(created.id);
    expect(await listFaqs()).toHaveLength(0);
  });
});
