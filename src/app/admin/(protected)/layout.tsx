import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { validateSession } from "@/lib/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth-guard";
import { LogoutButton } from "@/components/admin/logout-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

// This layout is the real auth gate (Node runtime, can use Prisma).
// middleware.ts only does a cheap cookie-presence redirect before this runs.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await validateSession(token) : null;

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white md:w-56 md:border-b-0 md:border-r">
          <div className="p-4">
            <p className="font-semibold text-navy-dark">Sanchari Admin</p>
          </div>
          <nav className="flex flex-row flex-wrap gap-1 px-2 pb-4 md:flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm text-slate-700 hover:bg-navy/5 hover:text-navy-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 pb-4">
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
