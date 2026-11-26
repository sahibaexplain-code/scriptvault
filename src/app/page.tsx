import Link from "next/link";
import { CATEGORIES, getBundles, getPublishedScripts } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { HeroScript } from "@/components/hero-script";
import { ScriptCard } from "@/components/script-card";
import { BundleCard } from "@/components/bundle-card";
import { Reveal } from "@/components/reveal";
import { IconArrow, IconCheck, IconDownload, IconEye, IconFile, IconLock, IconPen, IconShield } from "@/components/icons";

export const revalidate = 300;

export default async function Home() {
  const [scripts, bundles] = await Promise.all([getPublishedScripts(), getBundles()]);
  const featured = scripts.filter((s) => s.isFeatured).slice(0, 6);
  const languages = new Set(scripts.map((s) => s.language)).size;
  const catStats = CATEGORIES.map((c) => {
    const list = scripts.filter((s) => s.category === c.slug);
    return { ...c, count: list.length, from: list.length ? Math.min(...list.map((s) => s.priceInr)) : null };
  });
  const catOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgb(155_92_255/0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-[size:72px_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="container-x relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24">
          <div>
            <p className="chip animate-rise !normal-case !tracking-normal">
              <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px] shadow-success" />
              {scripts.length} scripts · {languages} languages · {CATEGORIES.length} genres
            </p>
            <h1 className="mt-6 animate-rise text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] [animation-delay:80ms] sm:text-6xl lg:text-[4.6rem]">
              Great Videos Start With{" "}
              <span className="font-display font-normal italic tracking-[-0.01em] text-volt-gradient">Great Scripts.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-8 text-muted [animation-delay:160ms]">
              Discover professionally written, engaging scripts designed for content creators. Hooks that hold, pacing that flows, and visual cues ready for your editor.
            </p>
            <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Link href="/scripts" className="btn-primary px-7 py-3.5 text-[15px]">Explore Scripts <IconArrow size={16} /></Link>
              <Link href="/custom" className="btn-ghost px-7 py-3.5 text-[15px]">Request Custom Script</Link>
            </div>
            <ul className="mt-10 grid animate-rise gap-x-6 gap-y-3 text-sm text-muted [animation-delay:320ms] sm:grid-cols-3">
              {[[IconEye, "Free preview on every script"], [IconDownload, "Instant PDF + DOCX"], [IconShield, "Commercial licence included"]].map(([I, t], k) => {
                const Ico = I as typeof IconEye;
                return <li key={k} className="flex items-center gap-2"><Ico size={16} className="text-volt-hi" />{t as string}</li>;
              })}
            </ul>
          </div>
          <div className="animate-rise [animation-delay:200ms]">
            <HeroScript />
          </div>
        </div>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <div className="overflow-hidden border-y border-line bg-ink-2/60 py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl italic text-white/35">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="flex items-center gap-10">{c.name}<span className="text-volt/70 not-italic">✦</span></span>
          ))}
        </div>
      </div>

      {/* ───────────── FEATURED ───────────── */}
      <section className="container-x pt-24">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Featured scripts</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Picked by our editors this week</h2>
            </div>
            <Link href="/scripts" className="inline-flex items-center gap-1.5 text-sm text-volt-hi hover:gap-2.5 transition-all">View all scripts <IconArrow size={15} /></Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 80}><ScriptCard script={s} category={catOf(s.category)} /></Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── CATEGORIES ───────────── */}
      <section className="container-x pt-28">
        <Reveal>
          <p className="eyebrow">Trending categories</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Eight genres that <span className="font-display font-normal italic text-volt-gradient">keep audiences watching</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {catStats.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 4) * 60}>
              <Link
                href={`/scripts?category=${c.slug}`}
                className="group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-2xl border border-line p-5 transition duration-300 hover:-translate-y-0.5 hover:border-volt/50"
                style={{ background: `radial-gradient(130% 100% at 100% 0%, ${c.palette[0]}33, transparent 60%), var(--color-ink-2)` }}
              >
                <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[17px] font-semibold leading-tight">{c.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{c.tagline}</p>
                  <p className="mt-3 flex items-center justify-between font-mono text-[11px] text-volt-hi">
                    <span>{c.count} scripts{c.from ? ` · from ${formatINR(c.from)}` : ""}</span>
                    <IconArrow size={14} className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="container-x pt-28">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[28px] border border-line bg-ink-2 p-6 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-volt/20 blur-[100px]" />
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From idea to upload in three scenes</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { scene: "INT. YOUR FEED — NIGHT", title: "Read before you buy", body: "Every script has a free preview: the hook and opening beats, exactly as written. Judge the writing, not a sales blurb.", Icon: IconEye },
                { scene: "INT. CHECKOUT — MOMENTS LATER", title: "Pick your licence", body: "Standard licence for most creators, or buy it exclusively so no one else can ever use it. Pay with UPI, card or netbanking.", Icon: IconLock },
                { scene: "INT. EDIT BAY — DAY", title: "Download and shoot", body: "Get a PDF for the teleprompter and an editable DOCX for your team, available forever in your dashboard.", Icon: IconFile },
              ].map((s, i) => (
                <div key={i} className="relative rounded-2xl border border-line bg-ink/60 p-6">
                  <p className="font-mono text-[10.5px] tracking-[0.14em] text-subtle">SCENE {i + 1} · {s.scene}</p>
                  <s.Icon size={22} className="mt-6 text-volt-hi" />
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── BUNDLES ───────────── */}
      <section className="container-x pt-28">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Best-selling bundles</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">More scripts, <span className="font-display font-normal italic text-volt-gradient">smaller price</span></h2>
            </div>
            <Link href="/bundles" className="inline-flex items-center gap-1.5 text-sm text-volt-hi transition-all hover:gap-2.5">All bundles <IconArrow size={15} /></Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bundles.slice(0, 3).map((b, i) => (
            <Reveal key={b.id} delay={i * 80}><BundleCard bundle={b} featured={i === 0} /></Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── LICENSING ───────────── */}
      <section className="container-x pt-28">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="eyebrow">Licensing, made plain</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Use it confidently. Monetise it freely.</h2>
              <p className="mt-4 text-muted leading-7">Every purchase includes a written licence in your download. No “fair use” guesswork, no surprise claims.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Standard", note: "Included with every purchase", points: ["Use on your own channels", "Monetised videos allowed", "Edit, translate, adapt freely", "Others may also buy it"] },
                { name: "Exclusive", note: "≈10× standard price, where offered", points: ["Everything in Standard", "Removed from sale after purchase", "Only offered on never-sold scripts", "Yours alone, permanently"], hi: true },
              ].map((l) => (
                <div key={l.name} className={`rounded-2xl border p-6 ${l.hi ? "border-volt/50 bg-volt/[0.07]" : "border-line bg-ink-2"}`}>
                  <p className="text-lg font-semibold">{l.name}</p>
                  <p className="mt-1 text-xs text-muted">{l.note}</p>
                  <ul className="mt-5 space-y-2.5">
                    {l.points.map((p) => <li key={p} className="flex gap-2.5 text-sm text-fg/85"><IconCheck size={16} className="mt-0.5 shrink-0 text-volt-hi" />{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── CUSTOM CTA ───────────── */}
      <section className="container-x pt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-volt/40 bg-gradient-to-br from-volt-lo/50 via-ink-2 to-ink-2 p-8 sm:p-14">
            <div className="pointer-events-none absolute -bottom-24 -right-10 font-display text-[16rem] leading-none italic text-white/[0.04] select-none">“</div>
            <div className="relative max-w-2xl">
              <IconPen size={26} className="text-volt-hi" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Need something only for your channel?</h2>
              <p className="mt-4 text-lg leading-8 text-muted">Tell us your topic, tone and runtime. A dedicated writer drafts it, you get two rounds of revisions, and the script is exclusively yours.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/custom" className="btn-primary px-7 py-3.5">Request Custom Script <IconArrow size={16} /></Link>
                <Link href="/contact" className="btn-ghost px-7 py-3.5">Ask a question</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="container-x pt-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Before you hit record</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="divide-y divide-line border-y border-line">
              {[
                ["Can I monetise videos made with these scripts?", "Yes. Both the Standard and Exclusive licences allow monetised use on your own channels and social accounts. Reselling the script text itself is not allowed."],
                ["What file formats will I get?", "Every purchase includes a PDF (perfect for teleprompters) and an editable DOCX that opens in Word or Google Docs. Downloads stay in your dashboard."],
                ["Are the facts checked?", "Our writers research every claim and separate legend from recorded history. Fact-based scripts include source notes you can paste into your description."],
                ["Can I edit the script or translate it?", "Absolutely. Adapt the tone, shorten it, or translate it. Make it sound like you."],
                ["What if the file doesn't open or something is wrong?", "Email us and we'll fix it or refund you. See our refund policy for the details."],
              ].map(([q, a]) => (
                <details key={q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-medium">
                    {q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-volt-hi transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-7 text-muted">{a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
