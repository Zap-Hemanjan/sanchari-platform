"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MediaAsset = {
  id: string;
  url: string;
  altText: string;
};

export function GalleryManager({ initialMedia }: { initialMedia: MediaAsset[] }) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    const uploadResponse = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const body = await uploadResponse.json().catch(() => ({}));
      setError(body.error ?? "Upload failed.");
      setIsUploading(false);
      return;
    }

    const { url } = await uploadResponse.json();

    const mediaResponse = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, altText: file.name, order: media.length }),
    });

    setIsUploading(false);

    if (mediaResponse.ok) {
      const created = await mediaResponse.json();
      setMedia((prev) => [...prev, created]);
      router.refresh();
    }

    event.target.value = "";
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setMedia((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block text-sm text-slate-600"
        />
        {isUploading && <p className="mt-1 text-xs text-slate-500">Uploading...</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
            <Image src={item.url} alt={item.altText} fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="absolute right-1 top-1 rounded bg-white/90 px-2 py-1 text-xs text-red-600 opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        ))}
        {media.length === 0 && (
          <p className="col-span-full text-sm text-slate-500">No images yet.</p>
        )}
      </div>
    </div>
  );
}
