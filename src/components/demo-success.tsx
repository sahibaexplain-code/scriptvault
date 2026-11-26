"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDemoOrders, type DemoOrder } from "@/lib/demo-store";
import { formatINR } from "@/lib/format";

export function DemoSuccess({ id }: { id: string }) {
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);
  useEffect(() => setOrder(getDemoOrders().find((o) => o.id === id) ?? null), [id]);
  if (order === undefined) return null;
  if (!order) return <p className="mt-6 text-muted">Demo order not found in this browser.</p>;
  return (
    <div className="mt-8 rounded-2xl border border-line bg-ink-2 p-5 text-left">
      <p className="font-mono text-xs text-subtle">ORDER {order.id} · {formatINR(order.amountInr)}</p>
      <ul className="mt-3 space-y-1.5 text-sm">{order.scripts.map((s) => <li key={s.id}>• {s.title}</li>)}</ul>
      <Link href="/dashboard" className="btn-primary mt-5 w-full">Go to downloads</Link>
    </div>
  );
}
