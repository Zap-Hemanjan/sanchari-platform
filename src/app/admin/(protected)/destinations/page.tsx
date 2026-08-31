import { listDestinations } from "@/lib/content/destinations";
import { DestinationManager } from "@/components/admin/destination-manager";

export default async function AdminDestinationsPage() {
  const destinations = await listDestinations();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Destinations</h1>
      <DestinationManager initialDestinations={destinations} />
    </div>
  );
}
