import Link from "next/link";
import { adminOrders, adminStats } from "@/lib/admin-data";
import { formatDate, formatINR } from "@/lib/format";
import { StatusPill } from "@/components/demo-dashboard";

export default async function AdminHome() {
  const [stats, orders] = await Promise.all([adminStats(), adminOrders(8)]);
  const cards = [
    ["Revenue (paid)", formatINR(stats.revenue)], ["Paid orders", stats.paidOrders], ["Customers", stats.customers],
    ["Scripts", stats.scripts], ["New custom requests", stats.openRequests], ["Orders needing review", stats.reviewOrders],
  ];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <Link href="/admin/scripts/new" className="btn-primary btn-sm">+ New script</Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map(([k, v]) => (
          <div key={k as string} className={`rounded-2xl border p-5 ${k === "Orders needing review" && Number(v) > 0 ? "border-amber/40 bg-amber/[0.06]" : "border-line bg-ink-2"}`}>
            <p className="text-2xl font-semibold tracking-tight">{v}</p><p className="mt-1 text-xs text-muted">{k}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 text-lg font-semibold">Recent orders</h2>
      <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-ink-2">
        {orders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
            <div className="min-w-0"><p className="line-clamp-1">{o.items.map((i) => i.title).join(", ")}</p><p className="font-mono text-[11px] text-subtle">{o.email} · {formatDate(o.createdAt)}</p></div>
            <div className="flex items-center gap-3"><span className="font-mono">{formatINR(o.amount)}</span><StatusPill status={o.status} /></div>
          </li>
        ))}
        {!orders.length && <li className="px-5 py-8 text-center text-sm text-muted">No orders yet.</li>}
      </ul>
    </div>
  );
}
