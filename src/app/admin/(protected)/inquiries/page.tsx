import { listInquiries } from "@/lib/content/inquiries";
import { InquiryManager } from "@/components/admin/inquiry-manager";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();
  const serialized = inquiries.map((inquiry) => ({
    ...inquiry,
    createdAt: inquiry.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Inquiries</h1>
      <InquiryManager initialInquiries={serialized} />
    </div>
  );
}
