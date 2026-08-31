import { notFound } from "next/navigation";
import { getPackageById } from "@/lib/content/packages";
import { PackageForm } from "@/components/admin/package-form";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPackageById(id);

  if (!pkg) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit package</h1>
      <PackageForm
        mode="edit"
        packageId={pkg.id}
        initial={{
          slug: pkg.slug,
          title: pkg.title,
          duration: pkg.duration,
          destination: pkg.destination,
          heroImageUrl: pkg.heroImageUrl,
          description: pkg.description,
          published: pkg.published,
          highlights: pkg.highlights.map((h) => h.text),
          inclusions: pkg.inclusions.map((i) => i.text),
          itinerary: pkg.itineraryDays.map((d) => ({
            title: d.title,
            summary: d.summary,
            details: d.details,
          })),
        }}
      />
    </div>
  );
}
