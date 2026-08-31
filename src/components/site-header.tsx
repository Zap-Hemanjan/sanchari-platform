"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/our-packages", label: "Our Packages" },
  { href: "/about-us", label: "About Us" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/contact-us", label: "Contact Us" },
];

// Matches the live site's own real business WhatsApp number — "Book Your
// Tour" is a WhatsApp deep link there too, not an internal booking flow
// (the site has no online payment/booking anywhere).
const WHATSAPP_URL = "https://wa.me/917337428436?text=Hello%20I%20would%20like%20to%20know%20more.";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-terracotta text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/sanchari-logo.webp"
            alt="Sanchari"
            width={140}
            height={38}
            unoptimized
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-navy transition hover:bg-white/90 md:inline-flex"
        >
          Book Your Tour <span aria-hidden>&rarr;</span>
        </a>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/20 md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-white px-5 py-2 text-center text-sm font-medium text-navy"
              onClick={() => setOpen(false)}
            >
              Book Your Tour
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
