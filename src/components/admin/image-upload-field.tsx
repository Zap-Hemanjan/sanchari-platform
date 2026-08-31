"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Upload failed.");
      return;
    }

    const { url } = await response.json();
    onChange(url);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {value && (
        <div className="relative mb-2 h-32 w-full max-w-xs overflow-hidden rounded border border-slate-200">
          <Image src={value} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
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
  );
}
