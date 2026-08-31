import Link from "next/link";
import { listPackages } from "@/lib/content/packages";
import { PackageList } from "@/components/admin/package-list";

export default async function AdminPackagesPage() {
  const packages = await listPackages();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
        >
          New package
        </Link>
      </div>
      <PackageList initialPackages={packages} />
    </div>
  );
}
