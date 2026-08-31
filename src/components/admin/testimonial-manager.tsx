"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Testimonial = {
  id: string;
  name: string;
  quote: string;
  published: boolean;
  order: number;
};

export function TestimonialManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, quote, order: testimonials.length }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const created = await response.json();
      setTestimonials((prev) => [...prev, created]);
      setName("");
      setQuote("");
      router.refresh();
    }
  }

  async function togglePublished(testimonial: Testimonial) {
    const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ published: !testimonial.published }),
    });
    if (response.ok) {
      const updated = await response.json();
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-3">
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.id}
            className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{testimonial.name}</p>
              <p className="text-sm text-slate-600">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="mt-1 text-xs text-slate-400">
                {testimonial.published ? "Published" : "Hidden"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => togglePublished(testimonial)}
                className="text-sm text-emerald-700 hover:underline"
              >
                {testimonial.published ? "Hide" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(testimonial.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {testimonials.length === 0 && (
          <p className="text-sm text-slate-500">No testimonials yet.</p>
        )}
      </ul>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Add a testimonial</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Quote</label>
          <textarea
            required
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add testimonial"}
        </button>
      </form>
    </div>
  );
}
