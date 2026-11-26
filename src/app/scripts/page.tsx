import type { Metadata } from "next";
import { CATEGORIES, getPublishedScripts } from "@/lib/catalog";
import { PageHeader } from "@/components/page-header";
import { ExploreClient, type ExploreParams } from "@/components/explore-client";

export const metadata: Metadata = { title: "Explore Scripts", description: "Browse ready-made YouTube, Reels and documentary scripts in Hindi, Hinglish and English." };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [scripts, raw] = await Promise.all([getPublishedScripts(), searchParams]);
  // Filters are read on the server so the filtered grid is in the initial HTML (good for SEO and first paint).
  const initial: ExploreParams = {};
  for (const k of ["q", "category", "language", "format", "price", "max", "sort"] as const) {
    const v = raw[k];
    if (typeof v === "string") initial[k] = v.slice(0, 100);
  }
  return (
    <>
      <PageHeader eyebrow="The vault" title="Explore" accent="every script" description="Filter by genre, language, format and budget. Every script has a free preview, so read before you buy." />
      <ExploreClient scripts={scripts} categories={CATEGORIES} initial={initial} />
    </>
  );
}
