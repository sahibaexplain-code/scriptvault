import { cn } from "@/lib/format";

/** Renders script markup (## headings, (cues), narration) like a formatted script page. */
export function ScriptText({ text, className, fadeOut }: { text: string; className?: string; fadeOut?: boolean }) {
  const lines = text.split(/\r?\n/);
  return (
    <div className={cn("relative", className)}>
      <div className="space-y-2.5">
        {lines.map((raw, i) => {
          const line = raw.trim();
          if (!line) return <div key={i} className="h-2" />;
          if (line.startsWith("## ")) {
            const m = line.slice(3).match(/^(\[[^\]]+\])?\s*(.*)$/);
            return (
              <p key={i} className="pt-3 font-mono text-[11px] tracking-[0.14em] text-volt-hi uppercase">
                {m?.[1] && <span className="mr-2 rounded bg-volt/15 px-1.5 py-0.5 text-volt-hi">{m[1].replace(/[[\]]/g, "")}</span>}
                {m?.[2]}
              </p>
            );
          }
          if (/^\(.*\)$/.test(line) || /^\[.*\]$/.test(line))
            return <p key={i} className="border-l border-volt/40 pl-3 font-mono text-[12px] leading-relaxed text-subtle">{line}</p>;
          return <p key={i} className="text-[15px] leading-7 text-fg/90">{line}</p>;
        })}
      </div>
      {fadeOut && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-2 to-transparent" />}
    </div>
  );
}
