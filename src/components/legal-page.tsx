import { PageHeader } from "./page-header";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={`Last updated ${updated}`} />
      <section className="container-x py-12">
        <div className="mb-8 max-w-3xl rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-xs leading-5 text-amber">
          Template text for a new store. Replace the bracketed details and have it reviewed by a lawyer before you start trading.
        </div>
        <article className="prose-legal">{children}</article>
      </section>
    </>
  );
}
