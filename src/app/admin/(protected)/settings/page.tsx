import { getSiteSettings } from "@/lib/content/hero";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Settings</h1>
      <SettingsForm
        initial={{
          statsYears: settings?.statsYears ?? null,
          statsTravelers: settings?.statsTravelers ?? null,
          statsDestinations: settings?.statsDestinations ?? null,
          statsSatisfaction: settings?.statsSatisfaction ?? null,
          contactPhone: settings?.contactPhone ?? null,
          contactEmail: settings?.contactEmail ?? null,
          contactLocation: settings?.contactLocation ?? null,
          contactHours: settings?.contactHours ?? null,
        }}
      />
    </div>
  );
}
