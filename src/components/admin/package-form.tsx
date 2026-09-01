"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type ItineraryDayDraft = { title: string; summary: string; details: string };

type PackageFormValues = {
  slug: string;
  title: string;
  duration: string;
  destination: string;
  heroImageUrl: string | null;
  description: string;
  categoryId: string | null;
  published: boolean;
  highlights: string[];
  inclusions: string[];
  itinerary: ItineraryDayDraft[];
};

const EMPTY: PackageFormValues = {
  slug: "",
  title: "",
  duration: "",
  destination: "",
  heroImageUrl: null,
  description: "",
  categoryId: null,
  published: true,
  highlights: [],
  inclusions: [],
  itinerary: [],
};

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none";

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                onChange(next);
              }}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="shrink-0 text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 text-sm text-navy hover:underline"
      >
        + Add
      </button>
    </div>
  );
}

export function PackageForm({
  mode,
  packageId,
  initial,
  categories,
}: {
  mode: "create" | "edit";
  packageId?: string;
  initial?: PackageFormValues;
  categories: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<PackageFormValues>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof PackageFormValues>(key: K, value: PackageFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateDay(index: number, field: keyof ItineraryDayDraft, value: string) {
    const next = [...values.itinerary];
    next[index] = { ...next[index], [field]: value };
    update("itinerary", next);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      ...values,
      highlights: values.highlights.filter((h) => h.trim() !== ""),
      inclusions: values.inclusions.filter((i) => i.trim() !== ""),
      itinerary: values.itinerary.map((day, index) => ({ ...day, dayNumber: index + 1 })),
    };

    const response = await fetch(
      mode === "create" ? "/api/admin/packages" : `/api/admin/packages/${packageId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/packages");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Package details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input
              required
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Slug (URL, lowercase-with-hyphens)
            </label>
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
            <input
              required
              placeholder="7 Days"
              value={values.duration}
              onChange={(e) => update("duration", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Destination</label>
            <input
              required
              placeholder="Tamil Nadu"
              value={values.destination}
              onChange={(e) => update("destination", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category (one of the 3 pillars)
            </label>
            <select
              required
              value={values.categoryId ?? ""}
              onChange={(e) => update("categoryId", e.target.value || null)}
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            required
            rows={3}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClass}
          />
        </div>
        <ImageUploadField
          label="Hero image"
          value={values.heroImageUrl}
          onChange={(url) => update("heroImageUrl", url)}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published (visible on the public site)
        </label>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <ListEditor
          label="Trip highlights"
          items={values.highlights}
          onChange={(v) => update("highlights", v)}
          placeholder="e.g. Brihadeeswarar Temple"
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <ListEditor
          label="Inclusions"
          items={values.inclusions}
          onChange={(v) => update("inclusions", v)}
          placeholder="e.g. Hotel, Meals, Flight"
        />
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Day-by-day itinerary</h2>
        {values.itinerary.map((day, index) => (
          <div key={index} className="space-y-2 rounded border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-navy">Day {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  update(
                    "itinerary",
                    values.itinerary.filter((_, i) => i !== index),
                  )
                }
                className="text-sm text-red-600 hover:underline"
              >
                Remove day
              </button>
            </div>
            <input
              placeholder="Day title"
              value={day.title}
              onChange={(e) => updateDay(index, "title", e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Short summary"
              value={day.summary}
              onChange={(e) => updateDay(index, "summary", e.target.value)}
              className={inputClass}
            />
            <textarea
              placeholder="Details (timings, activities, meals...)"
              rows={3}
              value={day.details}
              onChange={(e) => updateDay(index, "details", e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update("itinerary", [...values.itinerary, { title: "", summary: "", details: "" }])
          }
          className="text-sm text-navy hover:underline"
        >
          + Add day
        </button>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : mode === "create" ? "Create package" : "Save changes"}
      </button>
    </form>
  );
}
