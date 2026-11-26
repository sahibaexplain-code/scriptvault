"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { License, Script } from "@/lib/types";
import { cn, formatINR } from "@/lib/format";
import { useCart } from "./cart-provider";
import { IconCart, IconCheck, IconDownload, IconLock, IconShield } from "./icons";

export function PurchasePanel({ script }: { script: Script }) {
  const [license, setLicense] = useState<License>("standard");
  const cart = useCart();
  const router = useRouter();
  const exclusive = script.exclusiveAvailable && script.exclusivePriceInr;
  const price = license === "exclusive" && script.exclusivePriceInr ? script.exclusivePriceInr : script.priceInr;
  const item = { kind: "script" as const, id: script.id, slug: script.slug, title: script.title, license, priceInr: price };
  const inCart = cart.items.find((i) => i.kind === "script" && i.id === script.id);

  const options: { id: License; name: string; price: number | null; desc: string; disabled?: boolean }[] = [
    { id: "standard", name: "Standard licence", price: script.priceInr, desc: "Use on your own channels, monetisation allowed. Others may also license it." },
    {
      id: "exclusive", name: "Exclusive licence", price: script.exclusivePriceInr,
      desc: exclusive ? "Only you can use it. We take it off sale permanently after purchase." : "Not available: this script has already been licensed to other creators.",
      disabled: !exclusive,
    },
  ];

  return (
    <div className="rounded-3xl border border-line bg-ink-2 p-5 sm:p-6">
      <fieldset>
        <legend className="eyebrow mb-3">Choose a licence</legend>
        <div className="space-y-2.5">
          {options.map((o) => (
            <label key={o.id} className={cn("flex cursor-pointer gap-3 rounded-2xl border p-4 transition", o.disabled ? "cursor-not-allowed border-line opacity-50" : license === o.id ? "border-volt bg-volt/[0.08]" : "border-line hover:border-line-strong")}>
              <input type="radio" name="license" value={o.id} disabled={o.disabled} checked={license === o.id} onChange={() => setLicense(o.id)} className="mt-1 accent-[var(--color-volt)]" />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{o.name}</span>
                  <span className="font-mono text-sm">{o.price ? formatINR(o.price) : "—"}</span>
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">{o.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
        <span className="text-sm text-muted">Total</span>
        <span className="text-3xl font-semibold tracking-tight">{formatINR(price)}</span>
      </div>
      <p className="mt-1 text-right text-[11px] text-subtle">Inclusive of all taxes</p>

      <div className="mt-5 grid gap-2.5">
        <button className="btn-primary py-3.5 text-[15px]" onClick={() => { cart.add(item, { silent: true }); router.push("/checkout"); }}>Buy Now</button>
        <button className="btn-ghost py-3" onClick={() => (inCart && inCart.license === license ? router.push("/cart") : cart.add(item))}>
          <IconCart size={16} /> {inCart && inCart.license === license ? "In cart · View cart" : inCart ? "Update cart licence" : "Add to Cart"}
        </button>
      </div>

      <ul className="mt-6 space-y-2.5 text-xs text-muted">
        <li className="flex items-center gap-2.5"><IconDownload size={15} className="text-volt-hi" />Instant PDF + DOCX download after payment</li>
        <li className="flex items-center gap-2.5"><IconShield size={15} className="text-volt-hi" />Written licence included in every file</li>
        <li className="flex items-center gap-2.5"><IconLock size={15} className="text-volt-hi" />Secure checkout by Razorpay (UPI, cards, netbanking)</li>
        <li className="flex items-center gap-2.5"><IconCheck size={15} className="text-volt-hi" />Fix-or-refund guarantee on file issues</li>
      </ul>
    </div>
  );
}
