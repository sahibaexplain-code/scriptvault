"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Script } from "@/lib/types";
import { CATEGORIES } from "@/lib/catalog/sample-data";
import { IconTrash } from "./icons";

function F({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="block"><span className="label">{label}</span>{children}{hint && <span className="mt-1 block text-[11px] text-subtle">{hint}</span>}</label>;
}

interface Initial { script: Script; body: string; pdfPath: string | null; docxPath: string | null }

export function ScriptForm({ initial, readOnly }: { initial?: Initial; readOnly?: boolean }) {
  const router = useRouter();
  const s = initial?.script;
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (readOnly) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch(s ? `/api/admin/scripts/${s.id}` : "/api/admin/scripts", { method: s ? "PATCH" : "POST", body: new FormData(e.currentTarget) });
    const out = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ tone: "err", text: out.error ?? "Save failed" });
    setMsg({ tone: "ok", text: "Saved." });
    if (!s && out.id) router.replace(`/admin/scripts/${out.id}`);
    router.refresh();
  }

  async function onDelete() {
    if (!s || readOnly || !confirm(`Delete “${s.title}” permanently?`)) return;
    const res = await fetch(`/api/admin/scripts/${s.id}`, { method: "DELETE" });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg({ tone: "err", text: out.error ?? "Delete failed" });
    router.replace("/admin/scripts");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <fieldset disabled={readOnly || busy} className="space-y-8 disabled:opacity-80">
        <div className="space-y-5 rounded-2xl border border-line bg-ink-2 p-6">
          <p className="eyebrow">Basics</p>
          <F label="Title *"><input name="title" required defaultValue={s?.title} className="input" /></F>
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Subtitle"><input name="subtitle" defaultValue={s?.subtitle} className="input" /></F>
            <F label="URL slug" hint="Leave empty to generate from the title."><input name="slug" defaultValue={s?.slug} className="input font-mono" /></F>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <F label="Category *"><select name="category" defaultValue={s?.category ?? CATEGORIES[0].slug} className="input">{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></F>
            <F label="Language *"><select name="language" defaultValue={s?.language ?? "English"} className="input">{["Hindi", "Hinglish", "English"].map((l) => <option key={l}>{l}</option>)}</select></F>
            <F label="Format *"><select name="format" defaultValue={s?.format ?? "YouTube Long-form"} className="input">{["YouTube Long-form", "Reels / Shorts", "Documentary"].map((l) => <option key={l}>{l}</option>)}</select></F>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Video duration (minutes) *" hint="Use decimals for reels, e.g. 0.5 = 30 sec."><input name="durationMinutes" type="number" step="0.25" min="0.25" required defaultValue={s?.durationMinutes} className="input" /></F>
            <F label="Word count *"><input name="wordCount" type="number" min="1" required defaultValue={s?.wordCount} className="input" /></F>
          </div>
          <F label="Tags" hint="Comma-separated, used by search."><input name="tags" defaultValue={s?.tags.join(", ")} className="input" /></F>
        </div>

        <div className="space-y-5 rounded-2xl border border-line bg-ink-2 p-6">
          <p className="eyebrow">Pricing & licensing</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="Standard price (₹) *"><input name="priceInr" type="number" min="1" required defaultValue={s?.priceInr} className="input" /></F>
            <F label="Exclusive price (₹)" hint="Leave empty to never offer exclusivity."><input name="exclusivePriceInr" type="number" min="1" defaultValue={s?.exclusivePriceInr ?? ""} className="input" /></F>
          </div>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="exclusiveAvailable" defaultChecked={s?.exclusiveAvailable ?? true} className="accent-[var(--color-volt)]" />Offer exclusive licence <span className="text-xs text-subtle">(switches off automatically after the first sale)</span></label>
        </div>

        <div className="space-y-5 rounded-2xl border border-line bg-ink-2 p-6">
          <p className="eyebrow">Public content</p>
          <F label="Description"><textarea name="description" rows={3} defaultValue={s?.description} className="input" /></F>
          <F label="Free preview (public)" hint="Shown to everyone. Format: ‘## [00:00] HOOK’ for sections, ‘(VISUAL: …)’ for cues."><textarea name="preview" rows={8} defaultValue={s?.preview} className="input font-mono text-xs" /></F>
          <F label="Thumbnail image" hint="Optional PNG/JPG/WebP up to 5 MB. Without one, a branded thumbnail is generated."><input name="thumbnailFile" type="file" accept="image/png,image/jpeg,image/webp" className="input file:mr-3 file:rounded-full file:border-0 file:bg-volt/20 file:px-3 file:py-1 file:text-volt-hi" /></F>
        </div>

        <div className="space-y-5 rounded-2xl border border-volt/30 bg-volt/[0.04] p-6">
          <p className="eyebrow">Paid deliverable · private</p>
          <p className="text-xs leading-5 text-muted">Stored in a locked table and a private storage bucket. Customers only receive it through a server-verified download.</p>
          <F label="Full script text" hint="Used to auto-generate PDF & DOCX when no file is uploaded."><textarea name="body" rows={12} defaultValue={initial?.body} className="input font-mono text-xs" /></F>
          <div className="grid gap-5 sm:grid-cols-2">
            <F label="PDF file" hint={initial?.pdfPath ? `Current: ${initial.pdfPath}` : "Optional, max 20 MB"}><input name="pdfFile" type="file" accept="application/pdf" className="input" /></F>
            <F label="DOCX file" hint={initial?.docxPath ? `Current: ${initial.docxPath}` : "Optional, max 20 MB"}><input name="docxFile" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="input" /></F>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 rounded-2xl border border-line bg-ink-2 p-6 text-sm">
          <label className="flex items-center gap-3"><input type="checkbox" name="isPublished" defaultChecked={s?.isPublished ?? false} className="accent-[var(--color-volt)]" />Published (visible in store)</label>
          <label className="flex items-center gap-3"><input type="checkbox" name="isFeatured" defaultChecked={s?.isFeatured ?? false} className="accent-[var(--color-volt)]" />Featured on homepage</label>
        </div>
      </fieldset>

      {msg && <p className={`rounded-xl border px-4 py-2.5 text-sm ${msg.tone === "ok" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger"}`}>{msg.text}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="btn-primary px-8" disabled={readOnly || busy}>{readOnly ? "Saving disabled in demo" : busy ? "Saving…" : s ? "Save changes" : "Create script"}</button>
        {s && <button type="button" onClick={onDelete} disabled={readOnly} className="btn-ghost btn-sm !text-danger"><IconTrash size={14} /> Delete</button>}
      </div>
    </form>
  );
}
