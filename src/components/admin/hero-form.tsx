"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function HeroForm({
  initialHeadline,
  initialSubheadline,
  initialImageUrl,
}: {
  initialHeadline: string;
  initialSubheadline: string;
  initialImageUrl: string | null;
}) {
  const router = useRouter();
  const [heroHeadline, setHeroHeadline] = useState(initialHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(initialSubheadline);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(initialImageUrl);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ heroHeadline, heroSubheadline, heroImageUrl }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      setMessage("Saved. The homepage now shows this content.");
      router.refresh();
    } else {
      setMessage("Something went wrong saving the hero content.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Headline
        </label>
        <input
          required
          value={heroHeadline}
          onChange={(e) => setHeroHeadline(e.target.value)}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Subheadline
        </label>
        <textarea
          required
          value={heroSubheadline}
          onChange={(e) => setHeroSubheadline(e.target.value)}
          rows={3}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
        />
      </div>
      <ImageUploadField
        label="Hero image"
        value={heroImageUrl}
        onChange={setHeroImageUrl}
      />
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
