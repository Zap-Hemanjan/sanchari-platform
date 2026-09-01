import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPackageBySlug } from "@/lib/content/packages";
import { EnquiryForm } from "@/components/enquiry-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) return {};

  return {
    title: pkg.title,
    description: pkg.description,
    openGraph: {
      title: pkg.title,
      description: pkg.description,
      images: pkg.heroImageUrl ? [pkg.heroImageUrl] : undefined,
    },
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg || !pkg.published) {
    notFound();
  }

  return (
    <>
        <section className="relative flex min-h-[45vh] flex-col items-center justify-center overflow-hidden bg-navy px-4 py-16 text-center text-white sm:px-6">
          {pkg.heroImageUrl && (
            <Image
              src={pkg.heroImageUrl}
              alt=""
              fill
              unoptimized
              priority
              className="object-cover opacity-50"
            />
          )}
          <div className="relative">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {pkg.destination}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl">{pkg.title}</h1>
            <p className="mt-3 text-white/80">{pkg.duration}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div className="space-y-10 md:col-span-2">
            <div>
              <h2 className="mb-3 font-serif text-2xl text-terracotta">Trip Overview</h2>
              <p className="text-slate-700">{pkg.description}</p>
            </div>

            {pkg.highlights.length > 0 && (
              <div>
                <h2 className="mb-3 font-serif text-2xl text-terracotta">Trip Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pkg.highlights.map((highlight) => (
                    <li key={highlight.id} className="flex items-start gap-2 text-slate-700">
                      <span className="mt-1 text-terracotta" aria-hidden>
                        &#10003;
                      </span>
                      {highlight.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pkg.itineraryDays.length > 0 && (
              <div>
                <h2 className="mb-3 font-serif text-2xl text-terracotta">Day-by-Day Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itineraryDays.map((day, index) => (
                    <details
                      key={day.id}
                      open={index === 0}
                      className="group rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <summary className="cursor-pointer list-none font-medium text-slate-900 marker:content-none">
                        Day {day.dayNumber}: {day.title}
                      </summary>
                      <p className="mt-2 text-sm text-slate-600">{day.summary}</p>
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
                        {day.details}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {pkg.inclusions.length > 0 && (
              <div>
                <h2 className="mb-3 font-serif text-2xl text-terracotta">Inclusions</h2>
                <ul className="flex flex-wrap gap-2">
                  {pkg.inclusions.map((inclusion) => (
                    <li
                      key={inclusion.id}
                      className="rounded-full bg-navy/5 px-3 py-1 text-sm text-navy"
                    >
                      {inclusion.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 font-serif text-xl text-slate-900">Enquire About This Trip</h2>
              <EnquiryForm packageTitle={pkg.title} />
            </div>
          </aside>
        </section>
    </>
  );
}
