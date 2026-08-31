"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type Destination = {
  id: string;
  name: string;
  location: string;
  imageUrl: string | null;
};

export function DestinationManager({
  initialDestinations,
}: {
  initialDestinations: Destination[];
}) {
  const router = useRouter();
  const [destinations, setDestinations] = useState(initialDestinations);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, location, imageUrl, order: destinations.length }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const created = await response.json();
      setDestinations((prev) => [...prev, created]);
      setName("");
      setLocation("");
      setImageUrl(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-3">
        {destinations.map((destination) => (
          <li
            key={destination.id}
            className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{destination.name}</p>
              <p className="text-sm text-slate-600">{destination.location}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(destination.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {destinations.length === 0 && (
          <p className="text-sm text-slate-500">No destinations yet.</p>
        )}
      </ul>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Add a destination</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <ImageUploadField label="Image" value={imageUrl} onChange={setImageUrl} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add destination"}
        </button>
      </form>
    </div>
  );
}
