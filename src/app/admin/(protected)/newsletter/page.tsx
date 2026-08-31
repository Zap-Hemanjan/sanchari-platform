import { listNewsletterSubscribers } from "@/lib/content/newsletter";

export default async function AdminNewsletterPage() {
  const subscribers = await listNewsletterSubscribers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Newsletter Subscribers</h1>
      <ul className="space-y-2">
        {subscribers.map((subscriber) => (
          <li
            key={subscriber.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <span className="text-sm text-slate-900">{subscriber.email}</span>
            <span className="text-xs text-slate-400">
              {subscriber.createdAt.toLocaleDateString()}
            </span>
          </li>
        ))}
        {subscribers.length === 0 && (
          <p className="text-sm text-slate-500">No subscribers yet.</p>
        )}
      </ul>
    </div>
  );
}
