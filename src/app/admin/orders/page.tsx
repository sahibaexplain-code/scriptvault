import { adminOrders } from "@/lib/admin-data";
import { formatDate, formatINR } from "@/lib/format";
import { StatusPill } from "@/components/demo-dashboard";

export default async function AdminOrdersPage() {
  const orders = await adminOrders();
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-muted">Orders marked <b className="text-amber">review</b> were paid but couldn’t be fulfilled (an exclusive licence was claimed first). Refund them from the Razorpay dashboard.</p>
      <div className="mt-8 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className={`rounded-2xl border p-5 ${o.status === "review" ? "border-amber/40 bg-amber/[0.05]" : "border-line bg-ink-2"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-subtle">#{o.id.slice(0, 8).toUpperCase()} · {formatDate(o.createdAt)} · {o.email}</p>
                <ul className="mt-2 space-y-1 text-sm">{o.items.map((i, k) => <li key={k}>{i.title} <span className="font-mono text-[10px] text-subtle uppercase">· {i.license}</span></li>)}</ul>
              </div>
              <div className="text-right"><p className="font-mono">{formatINR(o.amount)}</p><div className="mt-1"><StatusPill status={o.status} /></div></div>
            </div>
            {o.paymentId && <p className="mt-3 font-mono text-[11px] text-subtle">Razorpay payment: {o.paymentId}</p>}
            {o.notes && <p className="mt-2 text-xs text-amber">{o.notes}</p>}
          </div>
        ))}
        {!orders.length && <p className="text-sm text-muted">No orders yet.</p>}
      </div>
    </div>
  );
}
