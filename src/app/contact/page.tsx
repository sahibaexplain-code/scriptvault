import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/forms";

export const metadata: Metadata = { title: "Contact", description: "Questions about a script, a download or licensing? Get in touch." };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to a" accent="real person" description="Questions about a script, a payment or licensing? We reply within one working day." />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          {[["Support", "support@scriptvault.example", "Downloads, payments and refunds"], ["Custom work", "studio@scriptvault.example", "Commissions and bulk orders"], ["Hours", "Mon–Sat, 10:00–19:00 IST", "Replies within one working day"]].map(([t, v, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-ink-2 p-5">
              <p className="eyebrow">{t}</p>
              <p className="mt-2 font-medium">{v}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
          <p className="text-xs text-subtle">Replace these placeholder addresses with your own in <code className="font-mono">src/app/contact/page.tsx</code>.</p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
