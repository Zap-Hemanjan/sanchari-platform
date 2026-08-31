import { listFaqs } from "@/lib/content/faqs";
import { FaqManager } from "@/components/admin/faq-manager";

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">FAQs</h1>
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
