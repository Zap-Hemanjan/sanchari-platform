import { listValueProps } from "@/lib/content/value-props";
import { ValuePropManager } from "@/components/admin/value-prop-manager";

export default async function AdminValuePropsPage() {
  const [sanchariWay, process] = await Promise.all([
    listValueProps("sanchari_way"),
    listValueProps("process"),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Value Props</h1>
      <ValuePropManager initialSanchariWay={sanchariWay} initialProcess={process} />
    </div>
  );
}
