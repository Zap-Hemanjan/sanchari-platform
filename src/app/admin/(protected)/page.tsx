import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [categoryCount, testimonialCount, mediaCount, inquiryCount] =
    await Promise.all([
      prisma.category.count(),
      prisma.testimonial.count(),
      prisma.mediaAsset.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
    ]);

  const cards = [
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials" },
    { label: "Gallery images", value: mediaCount, href: "/admin/gallery" },
    { label: "New inquiries", value: inquiryCount, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-navy hover:shadow-sm"
          >
            <p className="text-2xl font-semibold text-navy-dark">{card.value}</p>
            <p className="text-sm text-slate-600">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
