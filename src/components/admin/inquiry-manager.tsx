"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
};

export function InquiryManager({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState(initialInquiries);

  async function markRead(id: string) {
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });
    if (response.ok) {
      const updated = await response.json();
      setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      router.refresh();
    }
  }

  return (
    <ul className="space-y-3">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-slate-900">
                {inquiry.name} <span className="font-normal text-slate-500">({inquiry.email})</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">{inquiry.message}</p>
              <p className="mt-1 text-xs text-slate-400">
                {new Date(inquiry.createdAt).toLocaleString()} - {inquiry.status}
              </p>
            </div>
            {inquiry.status === "new" && (
              <button
                type="button"
                onClick={() => markRead(inquiry.id)}
                className="text-sm text-emerald-700 hover:underline"
              >
                Mark read
              </button>
            )}
          </div>
        </li>
      ))}
      {inquiries.length === 0 && (
        <p className="text-sm text-slate-500">No inquiries yet.</p>
      )}
    </ul>
  );
}
