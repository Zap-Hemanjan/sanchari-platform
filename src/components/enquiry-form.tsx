"use client";

import { useState, FormEvent } from "react";

const inputClass =
  "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none";

// Generalized version of the original homepage contact form — when
// `packageTitle` is set (package detail pages), also collects country and
// traveller counts so the admin inbox has full booking context.
export function EnquiryForm({ packageTitle }: { packageTitle?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        ...(packageTitle && {
          packageTitle,
          country: country || null,
          adults: Number(adults) || 0,
          children: Number(children) || 0,
        }),
      }),
    });

    if (response.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setCountry("");
      setAdults("1");
      setChildren("0");
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-lg bg-navy/5 p-4 text-navy">
        Thanks — we&apos;ll get back to you within 24 hours.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 text-left">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {packageTitle && (
        <>
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">
              Country
            </label>
            <input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="adults" className="mb-1 block text-sm font-medium text-slate-700">
                Adults
              </label>
              <input
                id="adults"
                type="number"
                min={0}
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="children" className="mb-1 block text-sm font-medium text-slate-700">
                Children
              </label>
              <input
                id="children"
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          {packageTitle ? "Tell us more" : "Tell us about your trip"}
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white transition hover:bg-terracotta-dark disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? (
          "Sending..."
        ) : (
          <>
            Send inquiry <span aria-hidden>&rarr;</span>
          </>
        )}
      </button>
    </form>
  );
}
