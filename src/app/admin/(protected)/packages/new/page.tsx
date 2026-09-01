import { PackageForm } from "@/components/admin/package-form";
import { listCategories } from "@/lib/content/categories";

export default async function NewPackagePage() {
  const categories = await listCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">New package</h1>
      <PackageForm mode="create" categories={categories} />
    </div>
  );
}
