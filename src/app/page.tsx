import type { Metadata } from "next";
import Image from "next/image";

// Content is admin-managed and must reflect edits immediately — without
// this, Next would statically prerender this page at build time and freeze
// whatever was in the database when `next build` ran.
export const dynamic = "force-dynamic";
import { getSiteSettings } from "@/lib/content/hero";
import { listCategories } from "@/lib/content/categories";
import { listTestimonials } from "@/lib/content/testimonials";
import { listMedia } from "@/lib/content/media";
import { ContactForm } from "@/components/contact-form";

const DEFAULT_HEADLINE = "Discover the Soul of South India";
const DEFAULT_SUBHEADLINE =
  "Curated temple circuits, adventure escapes and wellness retreats across South India.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const headline = settings?.heroHeadline ?? DEFAULT_HEADLINE;
  const description = settings?.heroSubheadline ?? DEFAULT_SUBHEADLINE;

  return {
    title: headline,
    description,
    openGraph: {
      title: headline,
      description,
      images: settings?.heroImageUrl ? [settings.heroImageUrl] : undefined,
    },
  };
}

export default async function HomePage() {
  const [settings, categories, testimonials, media] = await Promise.all([
    getSiteSettings(),
    listCategories(),
    listTestimonials({ publishedOnly: true }),
    listMedia(),
  ]);

  const headline = settings?.heroHeadline ?? DEFAULT_HEADLINE;
  const subheadline = settings?.heroSubheadline ?? DEFAULT_SUBHEADLINE;

  return (
    <main>
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center bg-emerald-900 px-4 py-24 text-center text-white sm:px-6">
        {settings?.heroImageUrl && (
          <Image
            src={settings.heroImageUrl}
            alt=""
            fill
            priority
            unoptimized
            className="object-cover opacity-40"
          />
        )}
        <div className="relative max-w-2xl">
          <h1 className="text-3xl font-bold sm:text-5xl">{headline}</h1>
          <p className="mt-4 text-base text-emerald-50 sm:text-lg">{subheadline}</p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-slate-900">
            Our Core Categories
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-slate-200 p-6 text-center"
              >
                {category.imageUrl && (
                  <div className="relative mx-auto mb-4 h-32 w-full overflow-hidden rounded">
                    <Image
                      src={category.imageUrl}
                      alt={category.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-medium text-emerald-800">{category.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-slate-50 px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-slate-900">
            What Travelers Say
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="rounded-lg bg-white p-6 shadow-sm"
              >
                <p className="text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-3 text-sm font-medium text-emerald-800">
                  {testimonial.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {media.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-slate-900">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {media.slice(0, 8).map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden rounded">
                <Image
                  src={item.url}
                  alt={item.altText}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-emerald-900 px-4 py-16 text-center text-white sm:px-6">
        <h2 className="mb-4 text-2xl font-semibold">Plan Your Journey</h2>
        <p className="mx-auto mb-8 max-w-md text-emerald-50">
          Ready to book, or need a custom itinerary? Tell us a little about
          your trip and we&apos;ll call you back within 24 hours.
        </p>
        <div className="rounded-lg bg-white p-6">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
