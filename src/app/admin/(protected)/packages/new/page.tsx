import { PackageForm } from "@/components/admin/package-form";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">New package</h1>
      <PackageForm mode="create" />
    </div>
  );
}
