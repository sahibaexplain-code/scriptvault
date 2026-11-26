import Link from "next/link";
import type { Metadata } from "next";
import { isLive } from "@/lib/env";
import { formatINR } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DemoSuccess } from "@/components/demo-success";
import { IconCheck } from "@/components/icons";

export const metadata: Metadata = { title: "Payment successful", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; demo?: string }> }) {
  const sp = await searchParams;
  let order: { id: string; status: string; amount_inr: number; razorpay_payment_id: string | null } | null = null;
  if (isLive && sp.order && (await getSessionUser())) {
    const sb = await createClient(); // RLS: only the buyer can read this order
    const { data } = await sb.from("orders").select("id, status, amount_inr, razorpay_payment_id").eq("id", sp.order).maybeSingle();
    order = data;
  }
  const review = order?.status === "review";

  return (
    <section className="container-x max-w-xl py-20 text-center">
      <span className="mx-auto grid size-16 animate-rise place-items-center rounded-full bg-volt text-white shadow-[0_0_60px_-10px] shadow-volt"><IconCheck size={30} /></span>
      <h1 className="mt-8 animate-rise text-4xl font-semibold tracking-tight">{review ? "Payment received" : "You’re all set."}</h1>
      <p className="mt-3 text-muted">
        {review
          ? "Another creator secured this exclusive licence moments before you. We’ll refund you in full within 24 hours, or you can email us to choose another script."
          : "Your scripts are unlocked. Download the PDF and DOCX from your dashboard any time."}
      </p>
      {sp.demo && <><p className="mx-auto mt-5 max-w-sm rounded-xl border border-amber/30 bg-amber/10 px-4 py-2.5 text-xs text-amber">Demo order: simulated, no payment was taken.</p><DemoSuccess id={sp.demo} /></>}
      {order && (
        <div className="mt-8 rounded-2xl border border-line bg-ink-2 p-5 text-left font-mono text-xs text-muted">
          <p>ORDER &nbsp;&nbsp;{order.id.slice(0, 8).toUpperCase()}</p>
          <p>AMOUNT &nbsp;{formatINR(order.amount_inr)}</p>
          <p>PAYMENT {order.razorpay_payment_id}</p>
          <p>STATUS &nbsp;{order.status.toUpperCase()}</p>
        </div>
      )}
      {!sp.demo && (
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary px-8">Go to my downloads</Link>
          <Link href="/scripts" className="btn-ghost px-8">Keep browsing</Link>
        </div>
      )}
    </section>
  );
}
