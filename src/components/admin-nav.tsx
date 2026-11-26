"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";

const LINKS = [["/admin", "Overview"], ["/admin/scripts", "Scripts"], ["/admin/orders", "Orders"], ["/admin/requests", "Custom requests"]] as const;

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start" aria-label="Admin">
      <p className="eyebrow mb-3 hidden px-3 lg:block">Admin</p>
      {LINKS.map(([href, label]) => {
        const on = href === "/admin" ? path === href : path.startsWith(href);
        return <Link key={href} href={href} className={cn("whitespace-nowrap rounded-xl px-3 py-2 text-sm transition", on ? "bg-volt/15 text-fg" : "text-muted hover:text-fg")}>{label}</Link>;
      })}
    </nav>
  );
}
