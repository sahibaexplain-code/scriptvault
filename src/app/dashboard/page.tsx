import Link from "next/link";
import type { Metadata } from "next";
import { isDemo } from "@/lib/env";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { DemoDashboard, OrderTable, StatusPill } from "@/components/demo-dashboard";
import { DownloadButtons, EmptyLibrary } from "@/components/dashboard-parts";

export const metadata: Metadata = { title: "My scripts", robots: { index: false } };
export const dynamic = "force-dynamic";

type PurchaseRow = { script_id: string; license: string; created_at: string; scripts: { slug: string; title: string; language: string; format: string; is_published: boolean } | null };
type OrderRow = { id: string; status: string; amount_inr: number; created_at: string; razorpay_payment_id: string | null; order_items: { title: string }[] };

export default async function DashboardPage() {
  if (isDemo) {
    return (
      <section className="container-x py-12 sm:py-16">
        <Header name={null} />
        <div className="mt-10"><DemoDashboard /></div>
      </section>
    );
  }

  const user = await requireUser("/dashboard");
  const sb = await createClient(); // queries run as the user; RLS limits rows to their own
  const [{ data: purchases }, { data: orders }, { data: requests }] = await Promise.all([
    sb.from("purchases").select("script_id, license, created_at, scripts(slug, title, language, format, is_published)").order("created_at", { ascending: false }),
    sb.from("orders").select("id, status, amount_inr, created_at, razorpay_payment_id, order_items(title)").neq("status", "created").order("created_at", { ascending: false }),
    sb.from("custom_requests").select("id, topic, language, duration, status, created_at").order("created_at", { ascending: false }),
  ]);
  const lib = (purchases ?? []) as unknown as PurchaseRow[];

  return (
    <section className="container-x py-12 sm:py-16">
      <Header name={user.fullName || user.email} />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[["Scripts owned", lib.length], ["Orders", (orders ?? []).length], ["Custom requests", (requests ?? []).length]].map(([k, v]) => (
          <div key={k as string} className="rounded-2xl border border-line bg-ink-2 p-5">
            <p className="text-3xl font-semibold">{v}</p><p className="mt-1 text-xs text-muted">{k}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">My scripts</h2>
        {lib.length ? (
          <ul className="mt-5 grid gap-3">
            {lib.map((p) => (
              <li key={p.script_id} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  {p.scripts?.is_published ? <Link href={`/scripts/${p.scripts.slug}`} className="font-medium hover:text-volt-hi">{p.scripts.title}</Link> : <p className="font-medium">{p.scripts?.title ?? "Script"}</p>}
                  <p className="mt-1 font-mono text-[11px] text-subtle uppercase">
                    {p.license === "exclusive" && <span className="mr-2 rounded bg-volt/20 px-1.5 py-0.5 text-volt-hi">Exclusive</span>}
                    {p.scripts?.language} · {p.scripts?.format} · bought {formatDate(p.created_at)}
                  </p>
                </div>
                <DownloadButtons scriptId={p.script_id} />
              </li>
            ))}
          </ul>
        ) : <EmptyLibrary />}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Purchase history</h2>
        <OrderTable rows={((orders ?? []) as OrderRow[]).map((o) => ({ id: o.id, date: o.created_at, items: o.order_items.map((i) => i.title), amount: o.amount_inr, status: o.status, payment: o.razorpay_payment_id ?? "—" }))} />
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Custom script requests</h2><Link href="/custom" className="text-sm text-volt-hi">New request →</Link></div>
        {requests?.length ? (
          <ul className="mt-5 grid gap-3">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-ink-2 p-5">
                <div><p className="font-medium">{r.topic}</p><p className="mt-1 font-mono text-[11px] text-subtle">{r.language} · {r.duration} · {formatDate(r.created_at)}</p></div>
                <StatusPill status={r.status} />
              </li>
            ))}
          </ul>
        ) : <p className="mt-5 text-sm text-muted">No custom requests yet.</p>}
      </section>
    </section>
  );
}

function Header({ name }: { name: string | null }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your <span className="font-display font-normal italic text-volt-gradient">library</span></h1>
        {name && <p className="mt-2 text-sm text-muted">Signed in as {name}</p>}
      </div>
      {name && <form action="/auth/signout" method="post"><button className="btn-ghost btn-sm">Sign out</button></form>}
    </div>
  );
}
