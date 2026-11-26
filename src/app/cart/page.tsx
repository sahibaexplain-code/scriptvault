"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatINR } from "@/lib/format";
import { IconArrow, IconCart, IconLayers, IconLock, IconTrash } from "@/components/icons";

export default function CartPage() {
  const { items, remove, totalInr, ready } = useCart();
  return (
    <section className="container-x py-12 sm:py-16">
      <p className="eyebrow">Cart</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your <span className="font-display font-normal italic text-volt-gradient">selection</span></h1>

      {!ready ? <div className="mt-10 h-40 animate-pulse rounded-3xl bg-ink-2" /> : items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line-strong p-14 text-center">
          <IconCart size={30} className="mx-auto text-subtle" />
          <p className="mt-4 font-display text-3xl italic">The page is blank.</p>
          <p className="mt-2 text-sm text-muted">Every great video starts somewhere. Start with a script.</p>
          <Link href="/scripts" className="btn-primary mt-7">Explore scripts</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line rounded-3xl border border-line bg-ink-2">
            {items.map((i) => (
              <li key={`${i.kind}-${i.id}`} className="flex items-center gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-volt/30 bg-volt/10 font-mono text-[10px] text-volt-hi">
                  {i.kind === "bundle" ? <IconLayers size={18} /> : "PDF"}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={i.kind === "bundle" ? `/bundles#${i.slug}` : `/scripts/${i.slug}`} className="line-clamp-1 font-medium hover:text-volt-hi">{i.title}</Link>
                  <p className="mt-0.5 font-mono text-[11px] text-subtle uppercase">{i.kind === "bundle" ? "Bundle · Standard licence" : `${i.license} licence`}</p>
                </div>
                <p className="font-mono text-sm">{formatINR(i.priceInr)}</p>
                <button onClick={() => remove(i.kind, i.id)} className="rounded-full p-2 text-subtle transition hover:bg-danger/10 hover:text-danger" aria-label={`Remove ${i.title}`}><IconTrash size={16} /></button>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-3xl border border-line bg-ink-2 p-6 lg:sticky lg:top-24">
            <div className="flex justify-between text-sm text-muted"><span>{items.length} item{items.length > 1 ? "s" : ""}</span><span>{formatINR(totalInr)}</span></div>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4"><span>Total</span><span className="text-2xl font-semibold">{formatINR(totalInr)}</span></div>
            <p className="mt-1 text-right text-[11px] text-subtle">Final price confirmed at checkout</p>
            <Link href="/checkout" className="btn-primary mt-6 w-full py-3.5">Checkout <IconArrow size={16} /></Link>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-subtle"><IconLock size={13} />Secure payment via Razorpay</p>
          </aside>
        </div>
      )}
    </section>
  );
}
