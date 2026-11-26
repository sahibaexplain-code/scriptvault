"use client";
import { useEffect, useState } from "react";

const HOOKS = [
  { tag: "WHAT IF", t: "00:00", line: "Imagine the planet stops. Not slows down. Stops. For one single second." },
  { tag: "MYSTERY", t: "00:00", line: "The tent has been cut open. From the inside." },
  { tag: "HINGLISH", t: "00:00", line: "Aapka dimaag aapko dhokha de chuka hai. Aur aapko pata bhi nahi chala." },
  { tag: "हिंदी", t: "00:00", line: "सोचिए, एक ऐसी दुनिया जहाँ रात कभी नहीं होती।" },
];

/** The hero's "live script page": types out real hooks from the catalogue. */
export function HeroScript() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const hook = HOOKS[i];
  const chars = Array.from(hook.line);

  useEffect(() => {
    if (n < chars.length) {
      const t = setTimeout(() => setN(n + 1), 28);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setI((i + 1) % HOOKS.length); setN(0); }, 2600);
    return () => clearTimeout(t);
  }, [n, chars.length, i]);

  return (
    <div className="relative">
      <div className="absolute -inset-10 -z-10 animate-glow rounded-full bg-volt/25 blur-[90px]" />
      <div className="grain overflow-hidden rounded-[22px] border border-line-strong bg-ink-2/90 shadow-[0_40px_120px_-40px_rgb(155_92_255/0.6)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-white/15" /><span className="size-2.5 rounded-full bg-volt/70" /></div>
          <span className="font-mono text-[11px] text-subtle">script_draft_final_v3.docx</span>
          <span className="font-mono text-[10px] text-volt-hi">● REC</span>
        </div>
        <div className="ruled relative grid grid-cols-[2.25rem_1fr] font-mono text-[12.5px] leading-8">
          <div className="border-r border-line text-right text-subtle/70 select-none">
            {Array.from({ length: 9 }, (_, k) => <div key={k} className="pr-2.5">{k + 1}</div>)}
          </div>
          <div className="min-h-[18rem] px-4 sm:px-5">
            <p className="text-volt-hi"><span className="mr-2 rounded bg-volt/15 px-1.5 py-0.5">{hook.t}</span>HOOK · {hook.tag}</p>
            <p className="text-subtle">(VISUAL: slow push-in, ambient drone)</p>
            <p className="font-sans text-[15px] leading-8 text-fg">
              {chars.slice(0, n).join("")}
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-blink bg-volt-hi" />
            </p>
            <p className="mt-2 text-subtle">(B-ROLL: archival texture, 2s)</p>
            <p className="text-volt-hi/70"><span className="mr-2 rounded bg-volt/10 px-1.5 py-0.5">00:35</span>SETUP</p>
            <div className="mt-2 space-y-2.5 pb-4">
              <div className="h-2 w-[92%] rounded bg-white/[0.07]" />
              <div className="h-2 w-[78%] rounded bg-white/[0.07]" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3">
          <div className="flex-1">
            <div className="mb-1 flex justify-between font-mono text-[10px] text-subtle"><span>RETENTION CURVE</span><span className="text-success">↑ hook holds</span></div>
            <svg viewBox="0 0 200 30" className="h-6 w-full" preserveAspectRatio="none" aria-hidden>
              <path d="M0 4 C 20 5, 30 9, 50 10 S 90 12, 110 13 S 150 15, 200 17" fill="none" stroke="#9b5cff" strokeWidth="1.6" />
              <path d="M0 4 C 20 5, 30 9, 50 10 S 90 12, 110 13 S 150 15, 200 17 V30 H0Z" fill="url(#rg)" opacity=".35" />
              <defs><linearGradient id="rg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9b5cff" /><stop offset="1" stopColor="#9b5cff" stopOpacity="0" /></linearGradient></defs>
            </svg>
          </div>
          <div className="text-right font-mono text-[10px] leading-4 text-subtle"><div>~1,480 words</div><div>10:00 runtime</div></div>
        </div>
      </div>
    </div>
  );
}
