import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Header and footer live here, not in each page, so they stay mounted
// across navigations between marketing pages — only the content in
// between (and loading.tsx's fallback while it loads) swaps out.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="top">{children}</main>
      <SiteFooter />
    </>
  );
}
