import type { Metadata } from "next";
import { Marcellus, Inter_Tight } from "next/font/google";
import "./globals.css";

// Matches the existing sanchari.travel brand: Marcellus for headings,
// Inter Tight for body copy. Self-hosted at build time (next/font/google
// downloads and serves these locally) — no third-party font CDN call.
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Sanchari — Discover the Soul of South India",
    template: "%s | Sanchari",
  },
  description:
    "Curated temple circuits, adventure escapes and wellness retreats across South India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${marcellus.variable} ${interTight.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
