import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CustomRequestForm } from "@/components/forms";
import { IconCheck } from "@/components/icons";

export const metadata: Metadata = { title: "Custom Scripts", description: "Commission an original script for your channel, written to your brief, exclusively yours." };

const TIERS = [
  { name: "Reels pack", price: "from ₹1,200", time: "3–4 days", points: ["5 scripts × 30–60 sec", "Hook + loop line + caption", "1 revision round"] },
  { name: "YouTube long-form", price: "from ₹2,500", time: "4–6 days", points: ["8–15 minute script", "Visual & B-roll cues", "2 revision rounds"], hi: true },
  { name: "Documentary", price: "from ₹6,000", time: "7–10 days", points: ["15–40 minute narrative", "Research & source notes", "Act structure + interview slots"] },
];

export default function CustomPage() {
  return (
    <>
      <PageHeader eyebrow="Custom scripts" title="Written for your channel." accent="Nobody else’s." description="Share a brief. We match you with a writer who knows your genre and language, and the finished script is exclusively yours." />
      <section className="container-x py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`rounded-3xl border p-6 ${t.hi ? "border-volt/50 bg-volt/[0.07]" : "border-line bg-ink-2"}`}>
              <p className="font-mono text-[11px] tracking-[0.14em] text-subtle uppercase">Delivery {t.time}</p>
              <p className="mt-3 text-lg font-semibold">{t.name}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-volt-hi">{t.price}</p>
              <ul className="mt-5 space-y-2">{t.points.map((p) => <li key={p} className="flex gap-2 text-sm text-fg/85"><IconCheck size={16} className="mt-0.5 shrink-0 text-volt-hi" />{p}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">How a commission works</h2>
            <ol className="mt-6 space-y-6">
              {[["Send the brief", "Topic, tone, runtime and language. The more references, the better."], ["Get a fixed quote", "Within 24 hours, with a delivery date. No payment until you approve."], ["Draft & revise", "Your writer delivers; you request changes in plain language."], ["Own it", "Final PDF + DOCX with an exclusive licence in your name."]].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-volt/40 font-mono text-xs text-volt-hi">{i + 1}</span>
                  <div><p className="font-medium">{t}</p><p className="mt-1 text-sm leading-6 text-muted">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <CustomRequestForm />
        </div>
      </section>
    </>
  );
}
