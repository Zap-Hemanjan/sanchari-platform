"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type Category = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  order: number;
};

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, description, imageUrl, order: categories.length }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const created = await response.json();
      setCategories((prev) => [...prev, created]);
      setTitle("");
      setDescription("");
      setImageUrl(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-3">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium text-slate-900">{category.title}</p>
              <p className="text-sm text-slate-600">{category.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(category.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-slate-500">No categories yet.</p>
        )}
      </ul>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">Add a category</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <ImageUploadField label="Image" value={imageUrl} onChange={setImageUrl} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add category"}
        </button>
      </form>
    </div>
  );
}
