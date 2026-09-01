import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content/hero";
import { listValueProps } from "@/lib/content/value-props";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A new vision for travel across South India — temple circuits, adventure escapes and wellness retreats.",
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-3xl text-terracotta">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export default async function AboutUsPage() {
  const [settings, values] = await Promise.all([
    getSiteSettings(),
    listValueProps("sanchari_way"),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-navy px-4 py-16 text-center text-white sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Home &gt; About Us
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">About Us</h1>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            A New Vision for Sacred Travel
          </p>
          <p className="mt-4 text-slate-700">
            India&apos;s temples are not merely destinations — they are living cultural spaces,
            carrying centuries of faith, art and tradition. Sanchari was born from a vision to
            transform South Indian travel, curating journeys where travellers are free to focus
            on what brought them there.
          </p>
          <p className="mt-4 text-slate-700">
            That vision spans three pillars: comprehensive <strong>Temple Tourism</strong>{" "}
            circuits, high-energy <strong>Adventure Experiences</strong> across the Western
            Ghats and coastline, and immersive <strong>Wellness &amp; Activities</strong>{" "}
            retreats rooted in traditional Kerala Ayurveda and yoga.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Our founder brings vision, trust and cultural ambition to Sanchari — a creative force
            behind the brand, rather than its day-to-day operations.
          </p>
        </section>

        {values.length > 0 && (
          <section className="bg-slate-50 px-4 py-16 sm:px-6">
            <h2 className="mb-10 text-center font-serif text-3xl text-terracotta">
              The Sanchari Way
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-navy">{value.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {settings &&
          (settings.statsYears || settings.statsTravelers || settings.statsDestinations || settings.statsSatisfaction) && (
            <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {settings.statsYears != null && (
                  <Stat value={`${settings.statsYears}+`} label="Years of Experience" />
                )}
                {settings.statsTravelers != null && (
                  <Stat value={`${settings.statsTravelers.toLocaleString()}+`} label="Happy Travelers" />
                )}
                {settings.statsDestinations != null && (
                  <Stat value={`${settings.statsDestinations}+`} label="Destinations" />
                )}
                {settings.statsSatisfaction != null && (
                  <Stat value={`${settings.statsSatisfaction}%`} label="Client Satisfaction" />
                )}
              </div>
            </section>
          )}

        <section className="bg-navy px-4 py-16 text-center text-white sm:px-6">
          <h2 className="mb-4 font-serif text-3xl">Begin Your Journey</h2>
          <p className="mx-auto mb-8 max-w-md text-white/80">
            Tell us about yourself and we&apos;ll arrange a personalized consultation.
          </p>
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 sm:p-8">
            <EnquiryForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
