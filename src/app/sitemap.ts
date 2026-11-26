import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { getPublishedScripts } from "@/lib/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/scripts", "/bundles", "/custom", "/about", "/contact", "/privacy", "/terms", "/refund-policy"].map((p) => ({ url: `${SITE_URL}${p}` }));
  const scripts = await getPublishedScripts().catch(() => []);
  return [...pages, ...scripts.map((s) => ({ url: `${SITE_URL}/scripts/${s.slug}`, lastModified: s.createdAt }))];
}
