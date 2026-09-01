import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listPackages } from "@/lib/content/packages";
import { listCategories } from "@/lib/content/categories";
import { listFaqs } from "@/lib/content/faqs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Packages",
  description:
    "Curated temple circuits, adventure escapes and wellness retreats across South India.",
};

function PackageCard({
  pkg,
}: {
  pkg: { id: string; slug: string; title: string; duration: string; destination: string; heroImageUrl: string | null };
}) {
  return (
    <Link
      href={`/trip/${pkg.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-gradient-to-br from-navy to-terracotta">
        {pkg.heroImageUrl && (
          <Image
            src={pkg.heroImageUrl}
            alt={pkg.title}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-slate-900">{pkg.title}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {pkg.duration} · {pkg.destination}
        </p>
      </div>
    </Link>
  );
}

export default async function OurPackagesPage() {
  const [packages, categories, faqs] = await Promise.all([
    listPackages({ publishedOnly: true }),
    listCategories(),
    listFaqs(),
  ]);

  const uncategorized = packages.filter((pkg) => !pkg.categoryId);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-navy px-4 py-16 text-center text-white sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Home &gt; Our Packages
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">Our Packages</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Curated temple circuits, adventure escapes and wellness retreats — every journey
            blends faith, culture, comfort and, where it fits, a little adrenaline.
          </p>
        </section>

        {packages.length === 0 ? (
          <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
            <p className="text-slate-500">Packages are being added — check back soon.</p>
          </section>
        ) : (
          categories.map((category) => {
            const categoryPackages = packages.filter((pkg) => pkg.categoryId === category.id);
            if (categoryPackages.length === 0) return null;

            return (
              <section key={category.id} className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
                <h2 className="mb-2 text-center font-serif text-3xl text-terracotta">
                  {category.title}
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-center text-sm text-slate-600">
                  {category.description}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {categoryPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        {uncategorized.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="mb-8 text-center font-serif text-3xl text-terracotta">
              More Packages
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {uncategorized.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="bg-slate-50 px-4 py-16 sm:px-6">
            <h2 className="mb-8 text-center font-serif text-3xl text-terracotta">
              Answers To Common Travel Questions
            </h2>
            <div className="mx-auto max-w-2xl space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-lg border border-slate-200 bg-white p-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
