"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type SettingsValues = {
  statsYears: number | null;
  statsTravelers: number | null;
  statsDestinations: number | null;
  statsSatisfaction: number | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactLocation: string | null;
  contactHours: string | null;
};

function toInputValue(value: number | null) {
  return value === null ? "" : String(value);
}

function toNullableInt(value: string) {
  return value === "" ? null : Number(value);
}

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const router = useRouter();
  const [values, setValues] = useState({
    statsYears: toInputValue(initial.statsYears),
    statsTravelers: toInputValue(initial.statsTravelers),
    statsDestinations: toInputValue(initial.statsDestinations),
    statsSatisfaction: toInputValue(initial.statsSatisfaction),
    contactPhone: initial.contactPhone ?? "",
    contactEmail: initial.contactEmail ?? "",
    contactLocation: initial.contactLocation ?? "",
    contactHours: initial.contactHours ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function field(key: keyof typeof values) {
    return {
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        statsYears: toNullableInt(values.statsYears),
        statsTravelers: toNullableInt(values.statsTravelers),
        statsDestinations: toNullableInt(values.statsDestinations),
        statsSatisfaction: toNullableInt(values.statsSatisfaction),
        contactPhone: values.contactPhone || null,
        contactEmail: values.contactEmail || null,
        contactLocation: values.contactLocation || null,
        contactHours: values.contactHours || null,
      }),
    });

    setIsSubmitting(false);
    setMessage(response.ok ? "Saved." : "Something went wrong saving settings.");
    if (response.ok) router.refresh();
  }

  const inputClass =
    "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Stats bar</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Years of experience</label>
            <input type="number" min={0} {...field("statsYears")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Happy travelers</label>
            <input type="number" min={0} {...field("statsTravelers")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Destinations</label>
            <input type="number" min={0} {...field("statsDestinations")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Satisfaction (%)</label>
            <input type="number" min={0} max={100} {...field("statsSatisfaction")} className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Contact information</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input {...field("contactPhone")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" {...field("contactEmail")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <input {...field("contactLocation")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Business hours</label>
          <input {...field("contactHours")} className={inputClass} />
        </div>
      </section>

      {message && <p className="text-sm text-navy">{message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
