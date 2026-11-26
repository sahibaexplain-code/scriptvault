import "server-only";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CATEGORIES } from "@/lib/catalog/sample-data";
import { slugify } from "@/lib/format";

const bool = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
const optInt = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(1).nullable());

export const scriptFormSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().max(80).optional(),
  subtitle: z.string().trim().max(200).default(""),
  category: z.enum(CATEGORIES.map((c) => c.slug) as [string, ...string[]]),
  language: z.enum(["Hindi", "Hinglish", "English"]),
  format: z.enum(["YouTube Long-form", "Reels / Shorts", "Documentary"]),
  durationMinutes: z.coerce.number().positive().max(600),
  wordCount: z.coerce.number().int().positive().max(100000),
  priceInr: z.coerce.number().int().min(1).max(1000000),
  exclusivePriceInr: optInt,
  exclusiveAvailable: bool,
  description: z.string().trim().max(3000).default(""),
  preview: z.string().trim().max(4000).default(""),
  body: z.string().max(200000).optional(),
  tags: z.string().default(""),
  isFeatured: bool,
  isPublished: bool,
});

export function parseScriptForm(fd: FormData) {
  const obj: Record<string, unknown> = {};
  for (const key of Object.keys(scriptFormSchema.shape)) {
    const v = fd.get(key);
    if (v !== null && typeof v === "string") obj[key] = v;
  }
  return scriptFormSchema.safeParse(obj);
}

export function toRow(d: z.infer<typeof scriptFormSchema>) {
  return {
    title: d.title,
    slug: slugify(d.slug || d.title) || `script-${Date.now()}`,
    subtitle: d.subtitle,
    category_slug: d.category,
    language: d.language,
    format: d.format,
    duration_minutes: d.durationMinutes,
    word_count: d.wordCount,
    price_inr: d.priceInr,
    exclusive_price_inr: d.exclusivePriceInr,
    exclusive_available: d.exclusiveAvailable && d.exclusivePriceInr != null,
    description: d.description,
    preview: d.preview,
    tags: d.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 12),
    is_featured: d.isFeatured,
    is_published: d.isPublished,
    updated_at: new Date().toISOString(),
  };
}

const MAX_DOC = 20 * 1024 * 1024;
const MAX_IMG = 5 * 1024 * 1024;

async function head(file: File, n: number) {
  return new Uint8Array(await file.slice(0, n).arrayBuffer());
}

/** Validates by size and magic bytes, not just the browser-supplied MIME type. */
export async function uploadFiles(sb: SupabaseClient, scriptId: string, fd: FormData) {
  const contentPatch: Record<string, string> = {};
  let thumbnailUrl: string | undefined;

  const pdf = fd.get("pdfFile");
  if (pdf instanceof File && pdf.size > 0) {
    const h = await head(pdf, 4);
    if (pdf.size > MAX_DOC || String.fromCharCode(...h) !== "%PDF") throw new Error("PDF must be a real PDF under 20 MB");
    const p = `${scriptId}/script.pdf`;
    const { error } = await sb.storage.from("script-files").upload(p, pdf, { upsert: true, contentType: "application/pdf" });
    if (error) throw error;
    contentPatch.pdf_path = p;
  }

  const docx = fd.get("docxFile");
  if (docx instanceof File && docx.size > 0) {
    const h = await head(docx, 2);
    if (docx.size > MAX_DOC || h[0] !== 0x50 || h[1] !== 0x4b) throw new Error("DOCX must be a real Word file under 20 MB");
    const p = `${scriptId}/script.docx`;
    const { error } = await sb.storage
      .from("script-files")
      .upload(p, docx, { upsert: true, contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    if (error) throw error;
    contentPatch.docx_path = p;
  }

  const img = fd.get("thumbnailFile");
  if (img instanceof File && img.size > 0) {
    const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[img.type];
    if (!ext || img.size > MAX_IMG) throw new Error("Thumbnail must be PNG, JPG or WebP under 5 MB");
    const p = `${scriptId}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("thumbnails").upload(p, img, { contentType: img.type });
    if (error) throw error;
    thumbnailUrl = sb.storage.from("thumbnails").getPublicUrl(p).data.publicUrl;
  }
  return { contentPatch, thumbnailUrl };
}
