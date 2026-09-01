"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PackageRow = {
  id: string;
  title: string;
  duration: string;
  destination: string;
  published: boolean;
  category: { title: string } | null;
};

export function PackageList({ initialPackages }: { initialPackages: PackageRow[] }) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);

  async function handleDelete(id: string) {
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    setPackages((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  return (
    <ul className="space-y-3">
      {packages.map((pkg) => (
        <li
          key={pkg.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
        >
          <div>
            <p className="font-medium text-slate-900">
              {pkg.title}
              {!pkg.published && (
                <span className="ml-2 text-xs font-normal text-slate-400">(unpublished)</span>
              )}
            </p>
            <p className="text-sm text-slate-600">
              {pkg.duration} · {pkg.destination}
              {pkg.category ? ` · ${pkg.category.title}` : (
                <span className="text-red-500"> · No category set</span>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={`/admin/packages/${pkg.id}`} className="text-sm text-navy hover:underline">
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(pkg.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
      {packages.length === 0 && <p className="text-sm text-slate-500">No packages yet.</p>}
    </ul>
  );
}
