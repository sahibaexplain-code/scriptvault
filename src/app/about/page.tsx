import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { IconArrow } from "@/components/icons";

export const metadata: Metadata = { title: "About", description: "ScriptVault is a script marketplace built for Indian and global creators." };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About ScriptVault" title="We write the words," accent="you bring them to life." description="ScriptVault started with a simple observation: the hardest part of making a great video is usually the blank page." />
      <section className="container-x grid gap-14 py-16 lg:grid-cols-2">
        <div className="space-y-5 text-[17px] leading-8 text-muted">
          <p>Creators spend days researching, outlining and rewriting before a single frame is shot. Many brilliant presenters, editors and animators simply don’t enjoy writing, and their channels stall because of it.</p>
          <p>We built a library of scripts that are <span className="text-fg">researched, structured for retention and ready to record</span>. Each one is written for a specific format, whether a ten-minute YouTube explainer, a forty-five-second reel or a long-form documentary, in the language your audience actually speaks: Hindi, Hinglish or English.</p>
          <p>Every script ships with timestamps, visual cues and B-roll notes, so it works for your editor as well as your voice.</p>
        </div>
        <div className="grid gap-4 self-start sm:grid-cols-2">
          {[["Retention first", "Hooks inside 5 seconds, re-hooks at drop-off points, clean outros."], ["Facts, not folklore", "Legend is labelled as legend. Source notes included where claims matter."], ["Written in your language", "Natural Hinglish, not translated English. Shuddh Hindi where it fits."], ["Licences you can trust", "Clear Standard and Exclusive terms, printed inside every file."]].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-ink-2 p-6">
              <p className="font-semibold">{t}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-ink-2 p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl font-display text-3xl italic leading-tight">“A video is only as good as the first ten seconds of its script.”</p>
          <Link href="/scripts" className="btn-primary shrink-0">Start exploring <IconArrow size={16} /></Link>
        </div>
      </section>
    </>
  );
}
