"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isLive } from "@/lib/env";
import { cn } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "./cart-provider";
import { Logo } from "./logo";
import { IconCart, IconMenu, IconUser, IconX } from "./icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/scripts", label: "Explore Scripts" },
  { href: "/bundles", label: "Bundles" },
  { href: "/custom", label: "Custom Scripts" },
  { href: "/about", label: "About" },
];

type Who = { email: string; admin: boolean } | null;

export function SiteHeader() {
  const path = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [who, setWho] = useState<Who>(null);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const sb = createClient();
    const load = async () => {
      const { data } = await sb.auth.getUser();
      if (!data.user) return setWho(null);
      const { data: p } = await sb.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      setWho({ email: data.user.email ?? "", admin: p?.role === "admin" });
    };
    load();
    const { data: sub } = sb.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent")}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("relative rounded-full px-3.5 py-2 text-sm transition", active(n.href) ? "text-fg" : "text-muted hover:text-fg")}>
              {n.label}
              {active(n.href) && <span className="absolute inset-x-3.5 -bottom-[1px] h-px bg-gradient-to-r from-transparent via-volt to-transparent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {who ? (
            <>
              {who.admin && <Link href="/admin" className="hidden rounded-full px-3 py-2 text-sm text-muted hover:text-fg sm:block">Admin</Link>}
              <Link href="/dashboard" className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-fg hover:border-volt/50 sm:inline-flex">
                <IconUser size={15} /> My scripts
              </Link>
            </>
          ) : (
            <Link href="/login" className={cn("hidden rounded-full px-3.5 py-2 text-sm transition hover:text-fg sm:block", active("/login") ? "text-fg" : "text-muted")}>
              Login
            </Link>
          )}
          <Link href="/cart" className="relative grid size-10 place-items-center rounded-full border border-line text-fg transition hover:border-volt/50 hover:bg-volt/10" aria-label={`Cart, ${count} items`}>
            <IconCart size={18} />
            {ready && count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-volt px-1 font-mono text-[10px] leading-5 text-white">{count}</span>
            )}
          </Link>
          <button className="grid size-10 place-items-center rounded-full border border-line lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="container-x animate-rise pb-5 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1 rounded-2xl border border-line bg-ink-2 p-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={cn("rounded-xl px-4 py-3 text-[15px]", active(n.href) ? "bg-volt/10 text-fg" : "text-muted")}>{n.label}</Link>
            ))}
            <div className="my-1 h-px bg-line" />
            {who ? (
              <>
                <Link href="/dashboard" className="rounded-xl px-4 py-3 text-[15px] text-muted">My scripts</Link>
                {who.admin && <Link href="/admin" className="rounded-xl px-4 py-3 text-[15px] text-muted">Admin</Link>}
                <form action="/auth/signout" method="post"><button className="w-full rounded-xl px-4 py-3 text-left text-[15px] text-muted">Sign out</button></form>
              </>
            ) : (
              <Link href="/login" className="rounded-xl px-4 py-3 text-[15px] text-muted">Login / Sign up</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
