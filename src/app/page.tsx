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
import { SiteHeader } from "@/components/site-header";
import { HeroCarousel } from "@/components/hero-carousel";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
      {children}
    </p>
  );
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

  // Rotate through the gallery for an "ongoing" hero, falling back to the
  // single admin-set hero image when no gallery photos exist yet.
  const heroImages =
    media.length > 0
      ? media.slice(0, 6).map((item) => item.url)
      : settings?.heroImageUrl
        ? [settings.heroImageUrl]
        : [];

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-navy px-4 py-24 text-center text-white sm:px-6">
          <HeroCarousel images={heroImages} />
          <div className="absolute inset-0 bg-navy/60" />
          <div className="relative max-w-2xl">
            <h1 className="font-serif text-4xl leading-tight sm:text-6xl">{headline}</h1>
            <p className="mt-4 text-base text-white/80 sm:text-lg">{subheadline}</p>
            <a
              href="#plan-your-journey"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-navy transition hover:bg-white/90"
            >
              Begin Your Journey <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </section>

        {categories.length > 0 && (
          <section id="categories" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Eyebrow>Discover Divine Tours</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              Find the Journey Meant for You
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative h-72 overflow-hidden rounded-2xl"
                >
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy to-terracotta transition duration-500 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition group-hover:from-black/85" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                    <h3 className="font-serif text-xl text-white">{category.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section className="bg-slate-50 px-4 py-20 sm:px-6">
            <Eyebrow>Traveler Stories</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              What Travelers Say
            </h2>
            <TestimonialsCarousel testimonials={testimonials} />
          </section>
        )}

        {media.length > 0 && (
          <section id="gallery" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Eyebrow>Gallery</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              Moments From the Journey
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {media.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={item.url}
                    alt={item.altText}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          id="plan-your-journey"
          className="bg-navy px-4 py-20 text-center text-white sm:px-6"
        >
          <h2 className="mb-4 font-serif text-3xl sm:text-4xl">Plan Your Journey</h2>
          <p className="mx-auto mb-8 max-w-md text-white/80">
            Ready to book, or need a custom itinerary? Tell us a little about
            your trip and we&apos;ll call you back within 24 hours.
          </p>
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
