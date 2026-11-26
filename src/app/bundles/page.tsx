import type { Metadata } from "next";
import { getBundles } from "@/lib/catalog";
import { PageHeader } from "@/components/page-header";
import { BundleCard } from "@/components/bundle-card";
import { Reveal } from "@/components/reveal";

export const revalidate = 300;
export const metadata: Metadata = { title: "Bundles", description: "Save up to 33% with curated script bundles for YouTube, Reels and documentaries." };

export default async function BundlesPage() {
  const bundles = await getBundles();
  return (
    <>
      <PageHeader eyebrow="Bundles" title="Curated packs," accent="priced to binge" description="Hand-picked sets built around a channel style. Every script in a bundle comes with the Standard licence and both file formats." />
      <section className="container-x py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {bundles.map((b, i) => <Reveal key={b.id} delay={i * 70}><BundleCard bundle={b} featured={i === 0} /></Reveal>)}
        </div>
        <p className="mt-10 text-center text-sm text-subtle">Already own a script in a bundle? You keep it; the bundle simply adds the rest to your library.</p>
      </section>
    </>
  );
}
