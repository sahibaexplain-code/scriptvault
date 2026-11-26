import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="ScriptVault home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden className="transition-transform duration-300 group-hover:rotate-[-6deg]">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9a6ff" /><stop offset="1" stopColor="#7b2ff7" /></linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#120c1f" stroke="url(#lg)" strokeWidth="1.5" />
        <path d="M9 10h9M9 14h6" stroke="#b98bff" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 18.5v6l5.5-3-5.5-3Z" fill="url(#lg)" />
        <rect x="21" y="9" width="1.6" height="7" rx=".8" fill="#e0c8ff" className="animate-blink" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight">
        Script<span className="font-display text-[20px] font-normal italic text-volt-hi">Vault</span>
      </span>
    </Link>
  );
}
