"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Faq = { id: string; question: string; answer: string };

export function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFaqs);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, answer, order: faqs.length }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const created = await response.json();
      setFaqs((prev) => [...prev, created]);
      setQuestion("");
      setAnswer("");
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-3">
        {faqs.map((faq) => (
          <li key={faq.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium text-slate-900">{faq.question}</p>
              <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(faq.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {faqs.length === 0 && <p className="text-sm text-slate-500">No FAQs yet.</p>}
      </ul>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Add a FAQ</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Question</label>
          <input
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Answer</label>
          <textarea
            required
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add FAQ"}
        </button>
      </form>
    </div>
  );
}
