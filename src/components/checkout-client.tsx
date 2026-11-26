"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-provider";
import { Modal } from "./modal";
import { formatINR } from "@/lib/format";
import { saveDemoOrder } from "@/lib/demo-store";
import { IconLock, IconShield } from "./icons";

type Mode = "demo" | "live" | "offline";
type BundleMap = Record<string, { id: string; slug: string; title: string }[]>;

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void } }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutClient({ mode, testMode, email, bundles }: { mode: Mode; testMode: boolean; email: string | null; bundles: BundleMap }) {
  const cart = useCart();
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  if (!cart.ready) return <div className="mt-10 h-60 animate-pulse rounded-3xl bg-ink-2" />;
  if (!cart.items.length)
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-line-strong p-14 text-center">
        <p className="font-display text-3xl italic">Nothing to check out yet.</p>
        <Link href="/scripts" className="btn-primary mt-6">Explore scripts</Link>
      </div>
    );

  async function payLive() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items.map(({ kind, id, license }) => ({ kind, id, license })) }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error ?? "Could not start checkout");
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Could not load Razorpay. Check your connection or ad-blocker.");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "ScriptVault",
        description: `${cart.items.length} item${cart.items.length > 1 ? "s" : ""}`,
        prefill: order.prefill,
        theme: { color: "#9b5cff" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: Record<string, string>) => {
          const v = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) });
          const out = await v.json();
          if (!v.ok) { setError(out.error ?? "Verification failed. If you were charged, contact support with your payment ID."); setBusy(false); return; }
          cart.clear();
          router.push(`/checkout/success?order=${out.orderId}`);
        },
      });
      rzp.on("payment.failed", (r) => { setError(r.error?.description ?? "Payment failed. No money was taken."); setBusy(false); });
      rzp.open();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  function completeDemo() {
    const scripts = cart.items.flatMap((i) =>
      i.kind === "bundle" ? (bundles[i.id] ?? []).map((s) => ({ ...s, license: "standard" as const })) : [{ id: i.id, slug: i.slug, title: i.title, license: i.license }]
    );
    const id = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    saveDemoOrder({
      id, createdAt: new Date().toISOString(), amountInr: cart.totalInr,
      items: cart.items.map(({ kind, title, license, priceInr }) => ({ kind, title, license, priceInr })),
      scripts: scripts.filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i),
    });
    cart.clear();
    router.push(`/checkout/success?demo=${id}`);
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-line bg-ink-2 p-6">
          <p className="eyebrow mb-4">Order summary</p>
          <ul className="divide-y divide-line">
            {cart.items.map((i) => (
              <li key={`${i.kind}-${i.id}`} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{i.title}</p>
                  <p className="font-mono text-[11px] text-subtle uppercase">{i.kind === "bundle" ? `Bundle · ${(bundles[i.id] ?? []).length} scripts` : `${i.license} licence`}</p>
                </div>
                <span className="font-mono text-sm">{formatINR(i.priceInr)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-line bg-ink-2 p-6">
          <p className="eyebrow mb-3">Delivery</p>
          <p className="text-sm leading-6 text-muted">
            {mode === "demo" ? "Demo mode: you’ll be able to download watermarked preview files from the demo dashboard." : <>Instant. Files appear in your dashboard{email ? <> for <span className="text-fg">{email}</span></> : ""} the moment payment is verified.</>}
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-line bg-ink-2 p-6 lg:sticky lg:top-24">
        <div className="flex items-baseline justify-between"><span className="text-muted">Total</span><span className="text-3xl font-semibold tracking-tight">{formatINR(cart.totalInr)}</span></div>
        <p className="mt-1 text-right text-[11px] text-subtle">Inclusive of all taxes · recalculated securely on our server</p>

        <label className="mt-6 flex cursor-pointer gap-3 rounded-2xl border border-line p-4 text-xs leading-5 text-muted">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[var(--color-volt)]" />
          <span>I agree to the <Link href="/terms" className="text-volt-hi underline">Terms & licence</Link> and understand this is a digital product covered by the <Link href="/refund-policy" className="text-volt-hi underline">Refund Policy</Link>.</span>
        </label>

        {error && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>}

        {mode === "offline" ? (
          <p className="mt-6 rounded-xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">Payments aren’t configured on this site yet. Add Razorpay keys to enable checkout.</p>
        ) : (
          <button className="btn-primary mt-6 w-full py-3.5 text-[15px]" disabled={!agree || busy} onClick={() => (mode === "demo" ? setDemoOpen(true) : payLive())}>
            <IconLock size={16} /> {busy ? "Opening secure checkout…" : `Pay ${formatINR(cart.totalInr)}`}
          </button>
        )}
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-subtle">
          <IconShield size={13} />
          {mode === "demo" ? "Simulated: no payment will be taken" : testMode ? "Razorpay TEST mode: use test cards" : "UPI · Cards · Netbanking · Wallets via Razorpay"}
        </p>
      </aside>

      <Modal open={demoOpen} onClose={() => setDemoOpen(false)} title="Simulated payment">
        <div className="text-center">
          <p className="chip mx-auto !border-amber/40 !text-amber">Demo mode · no real payment</p>
          <p className="mt-6 text-sm text-muted">In live mode, Razorpay’s secure checkout opens here and our server verifies the payment signature before unlocking downloads.</p>
          <p className="mt-6 text-4xl font-semibold tracking-tight">{formatINR(cart.totalInr)}</p>
          <div className="mt-8 grid gap-2">
            <button className="btn-primary py-3" onClick={completeDemo}>Simulate successful payment</button>
            <button className="btn-ghost py-3" onClick={() => { setDemoOpen(false); setError("Simulated failure: the payment was declined. Nothing was charged."); }}>Simulate failed payment</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
