import type { Bundle, Script } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToScript(r: any): Script {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? "",
    category: r.category_slug,
    language: r.language,
    format: r.format,
    durationMinutes: Number(r.duration_minutes),
    wordCount: r.word_count,
    priceInr: r.price_inr,
    exclusivePriceInr: r.exclusive_price_inr,
    exclusiveAvailable: Boolean(r.exclusive_available && r.exclusive_price_inr),
    description: r.description ?? "",
    preview: r.preview ?? "",
    tags: r.tags ?? [],
    thumbnailUrl: r.thumbnail_url,
    isFeatured: r.is_featured,
    isPublished: r.is_published,
    salesCount: r.sales_count ?? 0,
    rating: Number(r.rating ?? 0),
    createdAt: r.created_at,
  };
}

export function rowToBundle(r: any): Bundle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    priceInr: r.price_inr,
    badge: r.badge,
    isPublished: r.is_published,
    scriptIds: (r.bundle_items ?? []).map((i: any) => i.script_id),
  };
}

/** Public columns only. `script_contents` (the paid body) is a separate, locked table. */
export const SCRIPT_COLUMNS =
  "id, slug, title, subtitle, category_slug, language, format, duration_minutes, word_count, price_inr, exclusive_price_inr, exclusive_available, description, preview, tags, thumbnail_url, is_featured, is_published, sales_count, rating, created_at";
