import type { Category, Script } from "@/lib/types";
import { cn, formatDuration } from "@/lib/format";

/** Line-art motif per category, drawn in SVG so thumbnails never break or need hosting. */
function Motif({ kind }: { kind: Category["motif"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };
  switch (kind) {
    case "orbit":
      return (<g {...common}><circle cx="100" cy="100" r="26" /><ellipse cx="100" cy="100" rx="78" ry="26" transform="rotate(-24 100 100)" /><ellipse cx="100" cy="100" rx="60" ry="88" transform="rotate(30 100 100)" opacity=".6" /><circle cx="168" cy="72" r="5" fill="currentColor" /></g>);
    case "brain":
      return (<g {...common}>{[20, 36, 52, 68, 84].map((r) => <circle key={r} cx="100" cy="100" r={r} strokeDasharray={r % 32 === 4 ? "3 6" : undefined} />)}<path d="M40 100c20-30 40 30 60 0s40 30 60 0" /></g>);
    case "column":
      return (<g {...common}><path d="M48 46h104M54 56h92M60 56v100M80 56v100M100 56v100M120 56v100M140 56v100M50 156h100M42 168h116" /></g>);
    case "eye":
      return (<g {...common}><path d="M24 100c30-44 122-44 152 0-30 44-122 44-152 0Z" /><circle cx="100" cy="100" r="26" /><circle cx="100" cy="100" r="9" fill="currentColor" /><path d="M100 30v14M100 156v14M38 52l10 10M162 52l-10 10" opacity=".6" /></g>);
    case "chart":
      return (<g {...common}><path d="M36 166h132M36 166V40" /><path d="M56 166v-40M84 166v-62M112 166v-50M140 166v-92" strokeWidth="9" opacity=".35" /><path d="M48 132l34-30 26 14 50-62" /><path d="M146 54h12v12" /></g>);
    case "spark":
      return (<g {...common}><path d="M100 30c4 38 18 52 56 56-38 4-52 18-56 56-4-38-18-52-56-56 38-4 52-18 56-56Z" /><path d="M156 140c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18Z" opacity=".6" /></g>);
    case "smile":
      return (<g {...common}><circle cx="100" cy="100" r="62" /><path d="M72 112c14 22 42 22 56 0" /><circle cx="78" cy="86" r="5" fill="currentColor" /><circle cx="122" cy="86" r="5" fill="currentColor" /><path d="M150 40l10-10M162 54l14-4" opacity=".6" /></g>);
    case "film":
      return (<g {...common}><rect x="36" y="50" width="128" height="100" rx="6" />{[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={46 + i * 20} y="58" width="10" height="8" rx="1.5" /><rect x={46 + i * 20} y="134" width="10" height="8" rx="1.5" /></g>)}<path d="M88 84v32l26-16-26-16Z" fill="currentColor" /></g>);
  }
}

export function ScriptThumb({
  script, category, size = "card", className,
}: { script: Pick<Script, "title" | "subtitle" | "language" | "format" | "durationMinutes" | "thumbnailUrl">; category?: Category; size?: "card" | "hero"; className?: string }) {
  const [a, b] = category?.palette ?? ["#9b5cff", "#1b0f33"];
  const dur = script.durationMinutes < 1 ? `0:${String(Math.round(script.durationMinutes * 60)).padStart(2, "0")}` : `${script.durationMinutes}:00`;
  const reel = script.format === "Reels / Shorts";

  return (
    <div
      className={cn("grain relative overflow-hidden", size === "hero" ? "aspect-[16/10] rounded-2xl" : "aspect-video", className)}
      style={{ background: `radial-gradient(120% 120% at 85% 15%, ${a} 0%, ${b} 55%, #050407 100%)` }}
    >
      {script.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={script.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <>
          <svg viewBox="0 0 200 200" className="absolute -right-[8%] top-1/2 h-[135%] -translate-y-1/2 text-white/25 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2" aria-hidden>
            <Motif kind={category?.motif ?? "spark"} />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className={cn("absolute inset-x-0 bottom-0 z-[2]", size === "hero" ? "p-6 sm:p-8" : "p-4")}>
            <p className={cn("font-mono uppercase tracking-[0.16em] text-white/60", size === "hero" ? "text-xs" : "text-[10px]")}>
              {category?.name ?? "Script"}
            </p>
            <p className={cn("mt-1 max-w-[85%] font-display leading-[1.02] text-white", size === "hero" ? "text-4xl sm:text-5xl" : "text-[1.45rem] line-clamp-2")}>
              {script.title}
            </p>
          </div>
        </>
      )}
      <span className="absolute left-3 top-3 z-[2] rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white/90 backdrop-blur">
        {script.language.toUpperCase()}
      </span>
      <span className="absolute right-3 top-3 z-[2] rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white" title={formatDuration(script.durationMinutes)}>
        {reel ? "REEL · " : ""}{dur}
      </span>
    </div>
  );
}
