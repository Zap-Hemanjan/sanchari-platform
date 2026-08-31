import { getSiteSettings } from "@/lib/content/hero";
import { HeroForm } from "@/components/admin/hero-form";

export default async function AdminHeroPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Hero section</h1>
      <HeroForm
        initialHeadline={settings?.heroHeadline ?? ""}
        initialSubheadline={settings?.heroSubheadline ?? ""}
        initialImageUrl={settings?.heroImageUrl ?? null}
      />
    </div>
  );
}
