"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type ValueProp = { id: string; section: string; title: string; description: string };
type Section = "sanchari_way" | "process";

const TABS: { key: Section; label: string }[] = [
  { key: "sanchari_way", label: "The Sanchari Way" },
  { key: "process", label: "Process Steps" },
];

export function ValuePropManager({
  initialSanchariWay,
  initialProcess,
}: {
  initialSanchariWay: ValueProp[];
  initialProcess: ValueProp[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Section>("sanchari_way");
  const [items, setItems] = useState<Record<Section, ValueProp[]>>({
    sanchari_way: initialSanchariWay,
    process: initialProcess,
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeItems = items[activeTab];

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/admin/value-props", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        section: activeTab,
        title,
        description,
        order: activeItems.length,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      const created = await response.json();
      setItems((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], created] }));
      setTitle("");
      setDescription("");
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/value-props/${id}`, { method: "DELETE" });
    setItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== id),
    }));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-navy text-navy"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {activeItems.map((item) => (
          <li key={item.id} className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
        {activeItems.length === 0 && (
          <p className="text-sm text-slate-500">Nothing here yet.</p>
        )}
      </ul>

      <form onSubmit={handleCreate} className="max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-medium text-slate-900">
          Add to {TABS.find((t) => t.key === activeTab)?.label}
        </h2>
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
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
