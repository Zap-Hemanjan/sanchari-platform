import { listCategories } from "@/lib/content/categories";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Categories</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
