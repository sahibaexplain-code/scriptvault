"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { clearDemoOrders, getDemoOrders, type DemoOrder } from "@/lib/demo-store";
import { formatDate, formatINR } from "@/lib/format";
import { DownloadButtons, EmptyLibrary } from "./dashboard-parts";

export function DemoDashboard() {
  const [orders, setOrders] = useState<DemoOrder[] | null>(null);
  useEffect(() => setOrders(getDemoOrders()), []);
  if (!orders) return <div className="h-60 animate-pulse rounded-3xl bg-ink-2" />;
  const scripts = orders.flatMap((o) => o.scripts.map((s) => ({ ...s, at: o.createdAt }))).filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i);

  return (
    <div className="space-y-12">
      <div className="rounded-2xl border border-amber/30 bg-amber/10 px-5 py-4 text-sm text-amber">
        Demo dashboard: orders below were simulated and are stored only in this browser. Downloads contain the free preview, watermarked.
      </div>
      <section>
        <h2 className="text-xl font-semibold">My scripts</h2>
        {scripts.length ? (
          <ul className="mt-5 grid gap-3">
            {scripts.map((s) => (
              <li key={s.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <Link href={`/scripts/${s.slug}`} className="font-medium hover:text-volt-hi">{s.title}</Link>
                  <p className="mt-1 font-mono text-[11px] text-subtle uppercase">{s.license} licence · {formatDate(s.at)}</p>
                </div>
                <DownloadButtons scriptId={s.id} />
              </li>
            ))}
          </ul>
        ) : <EmptyLibrary />}
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Purchase history</h2>
          {orders.length > 0 && <button className="text-xs text-subtle underline" onClick={() => { clearDemoOrders(); setOrders([]); }}>Reset demo data</button>}
        </div>
        <OrderTable rows={orders.map((o) => ({ id: o.id, date: o.createdAt, items: o.items.map((i) => i.title), amount: o.amountInr, status: "paid (demo)", payment: "—" }))} />
      </section>
    </div>
  );
}

export function OrderTable({ rows }: { rows: { id: string; date: string; items: string[]; amount: number; status: string; payment: string }[] }) {
  if (!rows.length) return <p className="mt-5 text-sm text-muted">No orders yet.</p>;
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-ink-3 font-mono text-[11px] text-subtle uppercase">
          <tr><th className="px-4 py-3 font-normal">Order</th><th className="px-4 py-3 font-normal">Date</th><th className="px-4 py-3 font-normal">Items</th><th className="px-4 py-3 font-normal">Amount</th><th className="px-4 py-3 font-normal">Status</th><th className="px-4 py-3 font-normal">Payment ID</th></tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id} className="bg-ink-2">
              <td className="px-4 py-3 font-mono text-xs">{r.id.slice(0, 13).toUpperCase()}</td>
              <td className="px-4 py-3 text-muted">{formatDate(r.date)}</td>
              <td className="px-4 py-3"><span className="line-clamp-2">{r.items.join(", ")}</span></td>
              <td className="px-4 py-3 font-mono">{formatINR(r.amount)}</td>
              <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              <td className="px-4 py-3 font-mono text-xs text-muted">{r.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone = status.startsWith("paid") || status === "delivered" ? "border-success/30 bg-success/10 text-success" : status === "failed" || status === "closed" ? "border-danger/30 bg-danger/10 text-danger" : "border-amber/30 bg-amber/10 text-amber";
  return <span className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${tone}`}>{status.replace("_", " ")}</span>;
}
