import Link from "next/link";
import { Logo } from "./logo";
import { IconLock } from "./icons";

const COLS = [
  { title: "Shop", links: [["Explore Scripts", "/scripts"], ["Bundles", "/bundles"], ["Custom Scripts", "/custom"], ["Reels & Shorts", "/scripts?format=Reels%20%2F%20Shorts"]] },
  { title: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["My scripts", "/dashboard"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund-policy"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-volt/70 to-transparent" />
      <div className="container-x grid gap-12 py-14 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Ready-to-shoot scripts for YouTube, Reels and documentaries, in Hindi, Hinglish and English. Written by people, edited for retention.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted">
            <IconLock size={13} /> Payments secured by Razorpay · UPI, cards, netbanking
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-4">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-sm text-muted transition hover:text-fg">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-6 font-mono text-[11px] text-subtle sm:flex-row">
          <p>© {new Date().getFullYear()} ScriptVault. All rights reserved.</p>
          <p>FADE OUT.</p>
        </div>
      </div>
    </footer>
  );
}
