import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/our-packages", label: "Our Packages" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

// Social links are intentionally "#" pending Pranay providing the real
// account URLs — better to show them not-yet-wired than to silently drop
// them, but not to fake working links either.
const SOCIAL_LINKS = ["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube"];

export function SiteFooter() {
  return (
    <footer className="bg-navy-dark px-4 py-12 text-white sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-serif text-xl">Sanchari</p>
          <p className="mt-2 text-sm text-white/70">
            Curated temple circuits, adventure escapes and wellness retreats across South India.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Sign Up for Our Newsletter
          </p>
          <p className="mt-2 text-xs text-white/60">No spam. Just occasional updates.</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Sanchari. All rights reserved.
        </p>
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              title={`${label} (link coming soon)`}
              className="text-xs text-white/50 hover:text-white/80"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
