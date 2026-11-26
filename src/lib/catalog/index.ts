import "server-only";
import { createClient as createSbClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isLive } from "@/lib/env";
import type { Bundle, Script } from "@/lib/types";
import { BUNDLES, CATEGORIES, SCRIPTS } from "./sample-data";
import { SCRIPT_COLUMNS, rowToBundle, rowToScript } from "./mappers";

export { CATEGORIES };
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

/** Anonymous, cookie-less client for public catalogue reads (cache-friendly). RLS applies. */
function publicClient() {
  return createSbClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}

export async function getPublishedScripts(): Promise<Script[]> {
  if (!isLive) return SCRIPTS.filter((s) => s.isPublished);
  const { data, error } = await publicClient()
    .from("scripts")
    .select(SCRIPT_COLUMNS)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToScript);
}

export async function getScriptBySlug(slug: string): Promise<Script | null> {
  if (!isLive) return SCRIPTS.find((s) => s.slug === slug && s.isPublished) ?? null;
  const { data } = await publicClient()
    .from("scripts")
    .select(SCRIPT_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data ? rowToScript(data) : null;
}

export interface BundleWithScripts extends Bundle {
  scripts: Script[];
  worthInr: number;
}

export async function getBundles(): Promise<BundleWithScripts[]> {
  let bundles: Bundle[];
  let scripts: Script[];
  if (!isLive) {
    bundles = BUNDLES.filter((b) => b.isPublished);
    scripts = SCRIPTS;
  } else {
    const sb = publicClient();
    const { data, error } = await sb
      .from("bundles")
      .select("id, slug, title, description, price_inr, badge, is_published, bundle_items(script_id)")
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (error) throw error;
    bundles = (data ?? []).map(rowToBundle);
    scripts = await getPublishedScripts();
  }
  return bundles
    .map((b) => {
      const included = b.scriptIds.map((id) => scripts.find((s) => s.id === id)).filter(Boolean) as Script[];
      return { ...b, scripts: included, worthInr: included.reduce((n, s) => n + s.priceInr, 0) };
    })
    .filter((b) => b.scripts.length > 0);
}
