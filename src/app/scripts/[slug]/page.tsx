import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getPublishedScripts, getScriptBySlug } from "@/lib/catalog";
import { formatDuration, formatNumber } from "@/lib/format";
import { ScriptThumb } from "@/components/script-thumb";
import { ScriptText } from "@/components/script-text";
import { ScriptCard } from "@/components/script-card";
import { PurchasePanel } from "@/components/purchase-panel";
import { IconClock, IconFile, IconGlobe, IconLock, IconStar, IconText } from "@/components/icons";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Tolerate an empty/unmigrated database at build time; pages then render on demand.
  try {
    return (await getPublishedScripts()).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await getScriptBySlug((await params).slug);
  return s ? { title: s.title, description: s.description.slice(0, 160) } : { title: "Script not found" };
}

export default async function ScriptPage({ params }: Props) {
  const script = await getScriptBySlug((await params).slug);
  if (!script) notFound();
  const category = getCategory(script.category);
  const related = (await getPublishedScripts()).filter((s) => s.id !== script.id && (s.category === script.category || s.language === script.language)).slice(0, 3);

  const facts = [
    { Icon: IconGlobe, label: "Language", value: script.language },
    { Icon: IconClock, label: "Video duration", value: formatDuration(script.durationMinutes) },
    { Icon: IconText, label: "Word count", value: `${formatNumber(script.wordCount)} words` },
    { Icon: IconFile, label: "Format", value: script.format },
  ];

  return (
    <div className="container-x pb-10 pt-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] text-subtle" aria-label="Breadcrumb">
        <Link href="/scripts" className="hover:text-fg">EXPLORE</Link><span>/</span>
        <Link href={`/scripts?category=${script.category}`} className="hover:text-fg">{category?.name.toUpperCase()}</Link><span>/</span>
        <span className="line-clamp-1 text-muted">{script.slug.toUpperCase()}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          <ScriptThumb script={script} category={category} size="hero" className="animate-rise border border-line" />

          <div className="mt-8 animate-rise [animation-delay:80ms]">
            <p className="eyebrow">{category?.name}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">{script.title}</h1>
            <p className="mt-2 font-display text-xl italic text-muted">{script.subtitle}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1 text-amber">{Array.from({ length: 5 }, (_, i) => <IconStar key={i} size={14} className={i < Math.round(script.rating) ? "" : "opacity-25"} />)}</span>
              <span className="font-mono text-xs">{script.rating.toFixed(1)} · {formatNumber(script.salesCount)} creators licensed this</span>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink-2 p-4">
                <dt className="flex items-center gap-1.5 text-[11px] text-subtle"><f.Icon size={13} />{f.label}</dt>
                <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">About this script</h2>
            <p className="mt-3 leading-8 text-muted">{script.description}</p>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Free preview</h2>
              <span className="chip">Opening beats · as written</span>
            </div>
            <div className="ruled mt-4 overflow-hidden rounded-2xl border border-line bg-ink-2 p-5 sm:p-7">
              <ScriptText text={script.preview} fadeOut />
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-volt/40 bg-volt/[0.05] p-4 text-sm text-muted">
              <IconLock size={18} className="shrink-0 text-volt-hi" />
              The remaining ~{formatNumber(Math.max(script.wordCount - script.preview.split(/\s+/).length, 0))} words, with all visual cues and the outro, unlock instantly after purchase.
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold">What you get</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Full narration, timestamped by section", "Visual, B-roll and on-screen-text cues", "PDF for teleprompter + editable DOCX", "Written licence certificate in the file"].map((t) => (
                <li key={t} className="rounded-xl border border-line bg-ink-2 px-4 py-3 text-sm text-fg/85">{t}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">{script.tags.map((t) => <Link key={t} href={`/scripts?q=${encodeURIComponent(t)}`} className="chip hover:border-volt/50 hover:text-fg">#{t}</Link>)}</div>
          </section>
        </div>

        <aside className="lg:pt-0">
          <div className="lg:sticky lg:top-24"><PurchasePanel script={script} /></div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow">Keep exploring</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">You might also like</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => <ScriptCard key={s.id} script={s} category={getCategory(s.category)} />)}
          </div>
        </section>
      )}
    </div>
  );
}
