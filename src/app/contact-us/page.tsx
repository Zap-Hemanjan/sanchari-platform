import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content/hero";
import { listFaqs } from "@/lib/content/faqs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Connect with Sanchari's travel experts for bookings and support.",
};

export default async function ContactUsPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), listFaqs()]);

  const contactItems = [
    { label: "Phone", value: settings?.contactPhone },
    { label: "Email", value: settings?.contactEmail },
    { label: "Location", value: settings?.contactLocation },
    { label: "Hours", value: settings?.contactHours },
  ].filter((item) => item.value);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-navy px-4 py-16 text-center text-white sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Home &gt; Contact Us
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">Let&apos;s Plan Your Sacred Journey</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Sanchari is here to make your journey seamless and memorable. Connect with our
            travel experts for bookings, package details and dedicated support.
          </p>
        </section>

        {contactItems.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {contactItems.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-lg px-4 pb-16 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="mb-4 font-serif text-xl text-slate-900">Send an Enquiry</h2>
            <EnquiryForm />
          </div>
        </section>

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
