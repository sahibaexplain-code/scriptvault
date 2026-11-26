import type { Metadata } from "next";
import { isDemo, paymentsEnabled, razorpayTestMode } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { getBundles } from "@/lib/catalog";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // proxy.ts already redirects signed-out visitors to /login in live mode.
  const [user, bundles] = await Promise.all([getSessionUser(), getBundles()]);
  const bundleMap = Object.fromEntries(bundles.map((b) => [b.id, b.scripts.map((s) => ({ id: s.id, slug: s.slug, title: s.title }))]));
  const mode = isDemo ? "demo" : paymentsEnabled ? "live" : "offline";
  return (
    <section className="container-x py-12 sm:py-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Almost <span className="font-display font-normal italic text-volt-gradient">rolling.</span></h1>
      <CheckoutClient mode={mode} testMode={razorpayTestMode} email={user?.email ?? null} bundles={bundleMap} />
    </section>
  );
}
