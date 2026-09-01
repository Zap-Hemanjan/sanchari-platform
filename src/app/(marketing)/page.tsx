import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Content is admin-managed and must reflect edits immediately — without
// this, Next would statically prerender this page at build time and freeze
// whatever was in the database when `next build` ran.
export const dynamic = "force-dynamic";
import { getSiteSettings } from "@/lib/content/hero";
import { listCategories } from "@/lib/content/categories";
import { listTestimonials } from "@/lib/content/testimonials";
import { listMedia } from "@/lib/content/media";
import { listPackages } from "@/lib/content/packages";
import { listDestinations } from "@/lib/content/destinations";
import { listValueProps } from "@/lib/content/value-props";
import { EnquiryForm } from "@/components/enquiry-form";
import { HeroCarousel } from "@/components/hero-carousel";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { DestinationsCarousel } from "@/components/destinations-carousel";

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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-3xl text-terracotta">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export default async function HomePage() {
  const [settings, categories, testimonials, media, packages, destinations, sanchariWay, process] =
    await Promise.all([
      getSiteSettings(),
      listCategories(),
      listTestimonials({ publishedOnly: true }),
      listMedia(),
      listPackages({ publishedOnly: true }),
      listDestinations(),
      listValueProps("sanchari_way"),
      listValueProps("process"),
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

  const hasStats =
    settings?.statsYears != null ||
    settings?.statsTravelers != null ||
    settings?.statsDestinations != null ||
    settings?.statsSatisfaction != null;

  // Picks up to 2 packages per category so the homepage showcase represents
  // all 3 pillars, rather than whichever packages happen to be seeded/
  // ordered first (which skewed entirely temple before this fix).
  const showcasePackages = categories.flatMap((category) =>
    packages.filter((pkg) => pkg.categoryId === category.id).slice(0, 2),
  );

  return (
    <>
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

        {showcasePackages.length > 0 && (
          <section className="bg-slate-50 px-4 py-20 sm:px-6">
            <Eyebrow>Curated Journeys</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              Top Tour Packages
            </h2>
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3">
              {showcasePackages.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/trip/${pkg.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-40 w-full bg-gradient-to-br from-navy to-terracotta">
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
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/our-packages"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-medium text-white transition hover:bg-navy-dark"
              >
                View All Packages <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </section>
        )}

        {destinations.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Eyebrow>Featured Temples</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              Sacred Destinations
            </h2>
            <DestinationsCarousel destinations={destinations} />
          </section>
        )}

        {(sanchariWay.length > 0 || hasStats) && (
          <section className="bg-slate-50 px-4 py-20 sm:px-6">
            <Eyebrow>Why Sanchari</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              The Sanchari Way
            </h2>
            {sanchariWay.length > 0 && (
              <div className="mx-auto mb-12 grid max-w-4xl gap-6 sm:grid-cols-2">
                {sanchariWay.map((value) => (
                  <div key={value.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="font-serif text-lg text-navy">{value.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                  </div>
                ))}
              </div>
            )}
            {hasStats && (
              <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
                {settings?.statsYears != null && (
                  <Stat value={`${settings.statsYears}+`} label="Years of Experience" />
                )}
                {settings?.statsTravelers != null && (
                  <Stat value={`${settings.statsTravelers.toLocaleString()}+`} label="Happy Travelers" />
                )}
                {settings?.statsDestinations != null && (
                  <Stat value={`${settings.statsDestinations}+`} label="Destinations" />
                )}
                {settings?.statsSatisfaction != null && (
                  <Stat value={`${settings.statsSatisfaction}%`} label="Satisfaction" />
                )}
              </div>
            )}
          </section>
        )}

        {process.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
              Simple Steps To Your Dream Journey
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {process.map((step, index) => (
                <div key={step.id} className="text-center">
                  <p className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-medium text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
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
            <EnquiryForm />
          </div>
        </section>
    </>
  );
}
