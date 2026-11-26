"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Script } from "@/lib/types";
import { formatDuration, formatINR, formatNumber } from "@/lib/format";
import { useCart } from "./cart-provider";
import { Modal } from "./modal";
import { ScriptThumb } from "./script-thumb";
import { ScriptText } from "./script-text";
import { IconCart, IconClock, IconEye, IconGlobe, IconStar, IconText } from "./icons";

export function ScriptCard({ script, category }: { script: Script; category?: Category }) {
  const [preview, setPreview] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.has("script", script.id);
  const item = { kind: "script" as const, id: script.id, slug: script.slug, title: script.title, license: "standard" as const, priceInr: script.priceInr };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition duration-300 hover:-translate-y-1 hover:border-volt/40 hover:shadow-[0_20px_60px_-25px_rgb(155_92_255/0.55)]">
      <Link href={`/scripts/${script.slug}`} className="block" aria-label={script.title}>
        <ScriptThumb script={script} category={category} />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-[0.14em] text-volt-hi uppercase">{script.format}</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted"><IconStar size={12} className="text-amber" />{script.rating.toFixed(1)}</span>
        </div>
        <h3 className="text-[15px] leading-snug font-semibold text-fg">
          <Link href={`/scripts/${script.slug}`} className="hover:text-volt-hi">{script.title}</Link>
        </h3>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-line py-2.5 font-mono text-[11px] text-muted">
          <div className="flex items-center gap-1.5" title="Language"><IconGlobe size={13} /><dd>{script.language}</dd></div>
          <div className="flex items-center gap-1.5" title="Video duration"><IconClock size={13} /><dd>{formatDuration(script.durationMinutes)}</dd></div>
          <div className="flex items-center gap-1.5" title="Word count"><IconText size={13} /><dd>{formatNumber(script.wordCount)}w</dd></div>
        </dl>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight">{formatINR(script.priceInr)}</p>
            <p className="text-[11px] text-subtle">Standard licence</p>
          </div>
          <button onClick={() => setPreview(true)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-volt-hi transition hover:bg-volt/10">
            <IconEye size={14} /> Free preview
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className="btn-ghost btn-sm"
            onClick={() => (inCart ? router.push("/cart") : cart.add(item))}
            aria-label={inCart ? "View cart" : `Add ${script.title} to cart`}
          >
            <IconCart size={14} /> {inCart ? "In cart" : "Add to Cart"}
          </button>
          <button className="btn-primary btn-sm" onClick={() => { cart.add(item, { silent: true }); router.push("/checkout"); }}>
            Buy Now
          </button>
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title={`Free preview · ${script.title}`} wide>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="chip">{script.language}</span>
          <span className="chip">{formatDuration(script.durationMinutes)}</span>
          <span className="chip">{formatNumber(script.wordCount)} words</span>
        </div>
        <div className="ruled rounded-xl border border-line bg-ink p-5">
          <ScriptText text={script.preview} fadeOut />
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-subtle">— Preview ends here. The full script unlocks after purchase. —</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={`/scripts/${script.slug}`} className="btn-ghost flex-1" onClick={() => setPreview(false)}>View details</Link>
          <button className="btn-primary flex-1" onClick={() => { cart.add(item, { silent: true }); router.push("/checkout"); }}>
            Buy for {formatINR(script.priceInr)}
          </button>
        </div>
      </Modal>
    </article>
  );
}
