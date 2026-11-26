"use client";
import { useState } from "react";
import Link from "next/link";
import { IconCheck } from "./icons";

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string; demo?: boolean };

async function post(url: string, data: Record<string, unknown>): Promise<Status> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { state: "error", message: json.error ?? "Something went wrong" };
    return { state: "done", demo: Boolean(json.demo) };
  } catch {
    return { state: "error", message: "Network error. Please try again." };
  }
}

function Success({ title, body, demo }: { title: string; body: string; demo?: boolean }) {
  return (
    <div className="animate-rise rounded-3xl border border-volt/40 bg-volt/[0.06] p-8 text-center sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-volt text-white"><IconCheck size={26} /></span>
      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">{body}</p>
      {demo && <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber/30 bg-amber/10 px-4 py-2.5 text-xs text-amber">Demo mode: the form was validated, but nothing was stored or sent.</p>}
      <Link href="/scripts" className="btn-ghost mt-8">Browse ready-made scripts</Link>
    </div>
  );
}

export function CustomRequestForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  if (status.state === "done")
    return <Success demo={status.demo} title="Brief received" body="A writer will review your brief and email a quote and timeline within 24 hours. No payment is taken until you approve the quote." />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "sending" });
    setStatus(await post("/api/custom-request", Object.fromEntries(new FormData(e.currentTarget))));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="label">Your name *</span><input name="name" required minLength={2} className="input" autoComplete="name" /></label>
        <label><span className="label">Email *</span><input name="email" type="email" required className="input" autoComplete="email" /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <label><span className="label">Content type *</span>
          <select name="contentType" className="input" defaultValue="YouTube Long-form">
            {["YouTube Long-form", "Reels / Shorts", "Documentary", "Other"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
        <label><span className="label">Language *</span>
          <select name="language" className="input" defaultValue="Hinglish">{["Hindi", "Hinglish", "English"].map((o) => <option key={o}>{o}</option>)}</select>
        </label>
        <label><span className="label">Target duration *</span><input name="duration" required placeholder="e.g. 10 min, or 5 × 45s reels" className="input" /></label>
      </div>
      <label className="block"><span className="label">Topic / working title *</span><input name="topic" required minLength={5} placeholder="e.g. The rise and fall of Kingfisher Airlines" className="input" /></label>
      <label className="block"><span className="label">Brief</span>
        <textarea name="details" rows={5} className="input resize-y" placeholder="Tone, audience, references you like, must-cover points, channel link…" />
      </label>
      <div className="grid gap-5 sm:grid-cols-3">
        <label><span className="label">Budget (₹)</span>
          <select name="budget" className="input" defaultValue="">{["", "Under ₹1,500", "₹1,500 – ₹3,000", "₹3,000 – ₹6,000", "₹6,000+"].map((o) => <option key={o} value={o}>{o || "Not sure yet"}</option>)}</select>
        </label>
        <label><span className="label">Needed by</span><input name="deadline" type="date" className="input [color-scheme:dark]" /></label>
        <label><span className="label">Licence</span>
          <select name="license" className="input" defaultValue="exclusive"><option value="exclusive">Exclusive (default)</option><option value="standard">Standard (cheaper, may be resold)</option></select>
        </label>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status.state === "error" && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">{status.message}</p>}
      <button className="btn-primary w-full py-3.5 sm:w-auto sm:px-10" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending…" : "Send brief, get a quote"}
      </button>
      <p className="text-xs text-subtle">By submitting you agree to our <Link href="/terms" className="underline">terms</Link>. We’ll only use your email to reply to this request.</p>
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  if (status.state === "done") return <Success demo={status.demo} title="Message sent" body="Thanks for writing in. We reply to every message within one working day." />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "sending" });
    setStatus(await post("/api/contact", Object.fromEntries(new FormData(e.currentTarget))));
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label><span className="label">Name *</span><input name="name" required minLength={2} className="input" autoComplete="name" /></label>
        <label><span className="label">Email *</span><input name="email" type="email" required className="input" autoComplete="email" /></label>
      </div>
      <label className="block"><span className="label">Subject *</span>
        <select name="subject" className="input">{["Question about a script", "Download or payment issue", "Refund request", "Licensing", "Partnerships", "Something else"].map((o) => <option key={o}>{o}</option>)}</select>
      </label>
      <label className="block"><span className="label">Message *</span><textarea name="message" required minLength={10} rows={6} className="input resize-y" placeholder="Include your order or payment ID if this is about a purchase." /></label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status.state === "error" && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">{status.message}</p>}
      <button className="btn-primary w-full py-3.5 sm:w-auto sm:px-10" disabled={status.state === "sending"}>{status.state === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
