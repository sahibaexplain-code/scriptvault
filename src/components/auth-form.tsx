"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SITE_URL } from "@/lib/env";
import { cn } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot";

export function AuthForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const nextRaw = sp.get("next") ?? "/dashboard";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";
  const [mode, setMode] = useState<Mode>(sp.get("mode") === "signup" ? "signup" : "signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(
    sp.get("error") === "link" ? { tone: "err", text: "That link has expired or was already used. Please try again." } : null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const sb = createClient();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email, password,
          options: { data: { full_name: String(fd.get("name") ?? "").trim() }, emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        if (error) throw error;
        if (data.session) { router.replace(next); router.refresh(); }
        else setMsg({ tone: "ok", text: `We sent a confirmation link to ${email}. Click it to activate your account.` });
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/auth/callback?next=/account/reset` });
        if (error) throw error;
        setMsg({ tone: "ok", text: "If an account exists for that email, a reset link is on its way." });
      }
    } catch (err) {
      setMsg({ tone: "err", text: (err as Error).message || "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-line bg-ink-2 p-6 shadow-[0_40px_120px_-50px_rgb(155_92_255/0.6)] sm:p-8">
      {mode !== "forgot" && (
        <div className="mb-7 grid grid-cols-2 rounded-full border border-line bg-ink p-1 text-sm" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }} className={cn("rounded-full py-2 transition", mode === m ? "bg-volt text-white" : "text-muted hover:text-fg")}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      )}
      {mode === "forgot" && <p className="mb-6 text-sm text-muted">Enter your email and we’ll send you a link to set a new password.</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && <label className="block"><span className="label">Name</span><input name="name" className="input" autoComplete="name" /></label>}
        <label className="block"><span className="label">Email</span><input name="email" type="email" required className="input" autoComplete="email" /></label>
        {mode !== "forgot" && (
          <label className="block">
            <span className="label flex justify-between">Password {mode === "signin" && <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }} className="text-volt-hi">Forgot?</button>}</span>
            <input name="password" type="password" required minLength={8} className="input" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
            {mode === "signup" && <span className="mt-1.5 block text-[11px] text-subtle">At least 8 characters.</span>}
          </label>
        )}
        {msg && <p className={cn("rounded-xl border px-4 py-2.5 text-sm", msg.tone === "ok" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger")}>{msg.text}</p>}
        <button className="btn-primary w-full py-3" disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
      {mode === "forgot" && <button onClick={() => setMode("signin")} className="mt-5 text-sm text-volt-hi">← Back to sign in</button>}
      {mode === "signup" && <p className="mt-5 text-xs leading-5 text-subtle">By creating an account you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>}
    </div>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const a = String(fd.get("password")), b = String(fd.get("confirm"));
    if (a !== b) return setErr("Passwords don’t match");
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: a });
    setBusy(false);
    if (error) return setErr(error.message);
    router.replace("/dashboard");
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
      <label className="block"><span className="label">New password</span><input name="password" type="password" minLength={8} required className="input" autoComplete="new-password" /></label>
      <label className="block"><span className="label">Confirm password</span><input name="confirm" type="password" minLength={8} required className="input" autoComplete="new-password" /></label>
      {err && <p className="text-sm text-danger">{err}</p>}
      <button className="btn-primary w-full py-3" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
