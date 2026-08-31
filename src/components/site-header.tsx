"use client";

import { useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#categories", label: "Our Packages" },
  { href: "#gallery", label: "Gallery" },
  { href: "#plan-your-journey", label: "Contact Us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-terracotta text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/sanchari-logo.webp"
            alt="Sanchari"
            width={140}
            height={38}
            unoptimized
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition hover:text-white/80"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#plan-your-journey"
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
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#plan-your-journey"
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
