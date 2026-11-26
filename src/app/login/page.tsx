import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { isDemo } from "@/lib/env";
import { AuthForm } from "@/components/auth-form";
import { IconDownload, IconLock, IconShield } from "@/components/icons";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[120px]" />
      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-md">
          <p className="eyebrow">Your library</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Welcome <span className="font-display font-normal italic text-volt-gradient">back.</span></h1>
          <p className="mt-4 leading-7 text-muted">Sign in to download your scripts, see your purchase history and track custom commissions.</p>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3"><IconDownload size={17} className="text-volt-hi" />Re-download PDF and DOCX any time</li>
            <li className="flex items-center gap-3"><IconShield size={17} className="text-volt-hi" />Licence details stored with every order</li>
            <li className="flex items-center gap-3"><IconLock size={17} className="text-volt-hi" />Passwords are hashed; we never see them</li>
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md">
          {isDemo ? (
            <div className="rounded-3xl border border-line bg-ink-2 p-8">
              <p className="chip !border-amber/40 !text-amber">Demo mode</p>
              <h2 className="mt-5 text-xl font-semibold">Accounts are switched off in the demo</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Connect Supabase (see the README) to enable real sign-up, login and password reset. Meanwhile you can try the full purchase flow: demo orders are saved in this browser only.</p>
              <div className="mt-6 grid gap-2">
                <Link href="/dashboard" className="btn-primary">Open demo dashboard</Link>
                <Link href="/scripts" className="btn-ghost">Browse scripts</Link>
              </div>
            </div>
          ) : (
            <Suspense><AuthForm /></Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
