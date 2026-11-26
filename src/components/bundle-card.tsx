"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Script } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useCart } from "./cart-provider";
import { IconCheck, IconLayers } from "./icons";

interface Props {
  bundle: { id: string; slug: string; title: string; description: string; priceInr: number; badge: string | null; worthInr: number; scripts: Script[] };
  featured?: boolean;
}

export function BundleCard({ bundle, featured }: Props) {
  const cart = useCart();
  const router = useRouter();
  const save = bundle.worthInr - bundle.priceInr;
  const pct = bundle.worthInr ? Math.round((save / bundle.worthInr) * 100) : 0;
  const item = { kind: "bundle" as const, id: bundle.id, slug: bundle.slug, title: bundle.title, license: "standard" as const, priceInr: bundle.priceInr };

  return (
    <article id={bundle.slug} className={`relative flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${featured ? "border-volt/50 bg-gradient-to-b from-volt/[0.12] to-ink-2 shadow-[0_30px_80px_-40px_rgb(155_92_255/0.8)]" : "border-line bg-ink-2 hover:border-volt/40"}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl border border-volt/30 bg-volt/10 text-volt-hi"><IconLayers size={20} /></span>
        {bundle.badge && <span className="rounded-full bg-volt px-2.5 py-1 font-mono text-[10px] tracking-wider text-white uppercase">{bundle.badge}</span>}
      </div>
      <h3 className="mt-5 text-xl font-semibold">{bundle.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{bundle.description}</p>

      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {bundle.scripts.map((s) => (
          <li key={s.id} className="flex items-start gap-2.5 text-sm">
            <IconCheck size={16} className="mt-0.5 shrink-0 text-volt-hi" />
            <Link href={`/scripts/${s.slug}`} className="line-clamp-1 text-fg/85 hover:text-volt-hi">{s.title}</Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-semibold tracking-tight">{formatINR(bundle.priceInr)}</span>
          {save > 0 && <span className="text-sm text-subtle line-through">{formatINR(bundle.worthInr)}</span>}
        </div>
        {save > 0 && <p className="mt-1 text-xs text-success">You save {formatINR(save)} ({pct}%)</p>}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn-ghost btn-sm" onClick={() => (cart.has("bundle", bundle.id) ? router.push("/cart") : cart.add(item))}>
            {cart.has("bundle", bundle.id) ? "In cart" : "Add to Cart"}
          </button>
          <button className="btn-primary btn-sm" onClick={() => { cart.add(item, { silent: true }); router.push("/checkout"); }}>Buy Now</button>
        </div>
      </div>
    </article>
  );
}
