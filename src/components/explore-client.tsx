"use client";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Category, Script } from "@/lib/types";
import { cn, formatINR } from "@/lib/format";
import { ScriptCard } from "./script-card";
import { IconFilter, IconSearch, IconX } from "./icons";

const LANGS = ["Hindi", "Hinglish", "English"] as const;
const FORMATS = ["YouTube Long-form", "Reels / Shorts", "Documentary"] as const;
const PRICE_BANDS = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u400", label: "Under ₹400", min: 0, max: 399 },
  { id: "400-600", label: "₹400 – ₹600", min: 400, max: 600 },
  { id: "o600", label: "Over ₹600", min: 601, max: Infinity },
];
const SORTS = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={cn("rounded-full border px-3 py-1.5 text-xs transition", on ? "border-volt bg-volt/15 text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg")}>
      {children}
    </button>
  );
}

export type ExploreParams = Partial<Record<"q" | "category" | "language" | "format" | "price" | "max" | "sort", string>>;

export function ExploreClient({ scripts, categories, initial }: { scripts: Script[]; categories: Category[]; initial: ExploreParams }) {
  const sp = { get: (k: keyof ExploreParams) => initial[k] ?? null };
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cat, setCat] = useState(sp.get("category") ?? "");
  const [lang, setLang] = useState(sp.get("language") ?? "");
  const [format, setFormat] = useState(sp.get("format") ?? "");
  const [price, setPrice] = useState(sp.get("price") ?? "all");
  const [maxPrice, setMaxPrice] = useState(Number(sp.get("max")) || 0);
  const [sort, setSort] = useState(sp.get("sort") ?? "popular");
  const [panel, setPanel] = useState(false);

  const ceiling = useMemo(() => Math.max(...scripts.map((s) => s.priceInr), 100), [scripts]);

  // Keep the URL shareable without adding history entries on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (cat) p.set("category", cat);
      if (lang) p.set("language", lang);
      if (format) p.set("format", format);
      if (price !== "all") p.set("price", price);
      if (maxPrice) p.set("max", String(maxPrice));
      if (sort !== "popular") p.set("sort", sort);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [q, cat, lang, format, price, maxPrice, sort, pathname, router]);

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === price) ?? PRICE_BANDS[0];
    const needle = q.trim().toLowerCase();
    const list = scripts.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (lang && s.language !== lang) return false;
      if (format && s.format !== format) return false;
      if (s.priceInr < band.min || s.priceInr > band.max) return false;
      if (maxPrice && s.priceInr > maxPrice) return false;
      if (needle) {
        const cName = categories.find((c) => c.slug === s.category)?.name ?? "";
        const hay = `${s.title} ${s.subtitle} ${s.description} ${s.tags.join(" ")} ${cName} ${s.language}`.toLowerCase();
        if (!needle.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    return list.sort((a, b) =>
      sort === "newest" ? b.createdAt.localeCompare(a.createdAt)
        : sort === "price-asc" ? a.priceInr - b.priceInr
        : sort === "price-desc" ? b.priceInr - a.priceInr
        : b.salesCount - a.salesCount
    );
  }, [scripts, categories, q, cat, lang, format, price, maxPrice, sort]);

  const activeCount = [cat, lang, format, price !== "all" ? price : "", maxPrice ? "1" : ""].filter(Boolean).length;
  const reset = () => { setCat(""); setLang(""); setFormat(""); setPrice("all"); setMaxPrice(0); setQ(""); };

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          <Pill on={!cat} onClick={() => setCat("")}>All</Pill>
          {categories.map((c) => <Pill key={c.slug} on={cat === c.slug} onClick={() => setCat(cat === c.slug ? "" : c.slug)}>{c.name}</Pill>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Language</p>
        <div className="flex flex-wrap gap-2">
          <Pill on={!lang} onClick={() => setLang("")}>Any</Pill>
          {LANGS.map((l) => <Pill key={l} on={lang === l} onClick={() => setLang(lang === l ? "" : l)}>{l}</Pill>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Format</p>
        <div className="flex flex-wrap gap-2">
          <Pill on={!format} onClick={() => setFormat("")}>Any</Pill>
          {FORMATS.map((f) => <Pill key={f} on={format === f} onClick={() => setFormat(format === f ? "" : f)}>{f}</Pill>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Price</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => <Pill key={b.id} on={price === b.id} onClick={() => setPrice(b.id)}>{b.label}</Pill>)}
        </div>
        <label className="mt-5 block">
          <span className="flex justify-between text-xs text-muted"><span>Max price</span><span className="font-mono text-fg">{maxPrice ? formatINR(maxPrice) : "No limit"}</span></span>
          <input type="range" min={0} max={ceiling} step={50} value={maxPrice || ceiling} onChange={(e) => setMaxPrice(Number(e.target.value) >= ceiling ? 0 : Number(e.target.value))} className="mt-3 w-full accent-[var(--color-volt)]" aria-label="Maximum price" />
        </label>
      </div>
      {activeCount > 0 && <button onClick={reset} className="text-xs text-volt-hi underline underline-offset-4">Clear all filters</button>}
    </div>
  );

  return (
    <div className="container-x py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <IconSearch size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles, topics or tags: “mystery”, “hinglish”, “space”…" className="input !rounded-full !py-3 !pl-11" type="search" aria-label="Search scripts" />
        </label>
        <div className="flex gap-2">
          <button className="btn-ghost lg:hidden" onClick={() => setPanel(true)}><IconFilter size={16} /> Filters{activeCount ? ` (${activeCount})` : ""}</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !rounded-full !py-2.5" aria-label="Sort">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24">{filters}</div></aside>

        <div>
          <p className="mb-5 font-mono text-xs text-subtle">{results.length} {results.length === 1 ? "script" : "scripts"} found</p>
          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => <ScriptCard key={s.id} script={s} category={categories.find((c) => c.slug === s.category)} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-line-strong p-14 text-center">
              <p className="font-display text-3xl italic">Nothing in this scene.</p>
              <p className="mt-2 text-sm text-muted">Try a different search or loosen a filter, or ask us to write it for you.</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={reset} className="btn-ghost">Clear filters</button>
                <a href="/custom" className="btn-primary">Request this script</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {panel && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button className="absolute inset-0 bg-black/70" onClick={() => setPanel(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-rise overflow-y-auto rounded-t-3xl border-t border-line-strong bg-ink-2 p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold">Filters</p>
              <button onClick={() => setPanel(false)} aria-label="Close"><IconX /></button>
            </div>
            {filters}
            <button className="btn-primary mt-8 w-full" onClick={() => setPanel(false)}>Show {results.length} scripts</button>
          </div>
        </div>
      )}
    </div>
  );
}
