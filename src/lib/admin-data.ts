import "server-only";
import { isLive } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { SCRIPTS } from "@/lib/catalog/sample-data";
import { SCRIPT_COLUMNS, rowToScript } from "@/lib/catalog/mappers";
import type { Script } from "@/lib/types";

// Every function here must only be called after getAdminUser() (see app/admin/layout.tsx).

export async function adminScripts(): Promise<Script[]> {
  if (!isLive) return SCRIPTS;
  const { data } = await createAdminClient().from("scripts").select(SCRIPT_COLUMNS).order("created_at", { ascending: false });
  return (data ?? []).map(rowToScript);
}

export async function adminScript(id: string) {
  if (!isLive) {
    const s = SCRIPTS.find((x) => x.id === id);
    return s ? { script: s, body: "(Demo mode: full script text is hidden. In live mode it loads here for editing.)", pdfPath: null, docxPath: null } : null;
  }
  const sb = createAdminClient();
  const [{ data: s }, { data: c }] = await Promise.all([
    sb.from("scripts").select(SCRIPT_COLUMNS).eq("id", id).maybeSingle(),
    sb.from("script_contents").select("body, pdf_path, docx_path").eq("script_id", id).maybeSingle(),
  ]);
  if (!s) return null;
  return { script: rowToScript(s), body: c?.body ?? "", pdfPath: c?.pdf_path ?? null, docxPath: c?.docx_path ?? null };
}

export interface AdminOrder { id: string; email: string; status: string; amount: number; createdAt: string; paymentId: string | null; notes: string | null; items: { title: string; license: string }[] }

const DEMO_ORDERS: AdminOrder[] = [
  { id: "d3m0a1b2-0000-4000-8000-000000000001", email: "riya@example.com", status: "paid", amount: 1799, createdAt: "2026-11-24T09:12:00Z", paymentId: "pay_DEMO8x1", notes: null, items: [{ title: "Creator Starter Pack", license: "standard" }] },
  { id: "d3m0a1b2-0000-4000-8000-000000000002", email: "arjun@example.com", status: "paid", amount: 7499, createdAt: "2026-11-23T15:40:00Z", paymentId: "pay_DEMO8x2", notes: null, items: [{ title: "Dyatlov Pass: Nine Hikers, One Tent, No Easy Answers", license: "exclusive" }] },
  { id: "d3m0a1b2-0000-4000-8000-000000000003", email: "meera@example.com", status: "review", amount: 4999, createdAt: "2026-11-22T11:05:00Z", paymentId: "pay_DEMO8x3", notes: "Exclusive licence already claimed by another buyer. Refund or offer an alternative.", items: [{ title: "What If the Earth Stopped Spinning for One Second?", license: "exclusive" }] },
  { id: "d3m0a1b2-0000-4000-8000-000000000004", email: "kabir@example.com", status: "failed", amount: 449, createdAt: "2026-11-21T18:30:00Z", paymentId: null, notes: null, items: [{ title: "Dimaag Ka Dhokha: 7 Cognitive Biases", license: "standard" }] },
];

export async function adminOrders(limit = 100): Promise<AdminOrder[]> {
  if (!isLive) return DEMO_ORDERS;
  const sb = createAdminClient();
  const { data } = await sb
    .from("orders")
    .select("id, user_id, status, amount_inr, created_at, razorpay_payment_id, notes, order_items(title, license)")
    .neq("status", "created")
    .order("created_at", { ascending: false })
    .limit(limit);
  // Look up emails via the Auth admin API (emails aren't stored in public tables).
  const emails = new Map<string, string>();
  await Promise.all(
    [...new Set((data ?? []).map((o) => o.user_id))].map(async (uid) => {
      const { data: u } = await sb.auth.admin.getUserById(uid);
      emails.set(uid, u.user?.email ?? "—");
    })
  );
  return (data ?? []).map((o) => ({
    id: o.id, email: emails.get(o.user_id) ?? "—", status: o.status, amount: o.amount_inr, createdAt: o.created_at,
    paymentId: o.razorpay_payment_id, notes: o.notes, items: o.order_items as { title: string; license: string }[],
  }));
}

export interface AdminRequest { id: string; name: string; email: string; contentType: string; language: string; duration: string; topic: string; details: string; budget: string | null; deadline: string | null; license: string; status: string; createdAt: string }

export async function adminRequests(): Promise<AdminRequest[]> {
  if (!isLive)
    return [
      { id: "demo-req-1", name: "Sana Q.", email: "sana@example.com", contentType: "YouTube Long-form", language: "Hinglish", duration: "12 min", topic: "Kingfisher Airlines: the rise and fall", details: "Business breakdown tone, like a case study. Want a strong cold open.", budget: "₹3,000 – ₹6,000", deadline: "2026-12-05", license: "exclusive", status: "new", createdAt: "2026-11-25T08:00:00Z" },
      { id: "demo-req-2", name: "Dev P.", email: "dev@example.com", contentType: "Reels / Shorts", language: "Hindi", duration: "5 × 45s", topic: "Ancient Indian inventions", details: "", budget: "Under ₹1,500", deadline: null, license: "standard", status: "quoted", createdAt: "2026-11-20T08:00:00Z" },
    ];
  const { data } = await createAdminClient().from("custom_requests").select("*").order("created_at", { ascending: false }).limit(200);
  return (data ?? []).map((r) => ({
    id: r.id, name: r.name, email: r.email, contentType: r.content_type, language: r.language, duration: r.duration, topic: r.topic,
    details: r.details, budget: r.budget, deadline: r.deadline, license: r.license, status: r.status, createdAt: r.created_at,
  }));
}

export async function adminStats() {
  if (!isLive) return { revenue: 9298, paidOrders: 2, customers: 4, scripts: SCRIPTS.length, openRequests: 1, reviewOrders: 1 };
  const sb = createAdminClient();
  const [paid, customers, scripts, reqs, review] = await Promise.all([
    sb.from("orders").select("amount_inr").eq("status", "paid"),
    sb.from("profiles").select("id", { count: "exact", head: true }),
    sb.from("scripts").select("id", { count: "exact", head: true }),
    sb.from("custom_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "review"),
  ]);
  return {
    revenue: (paid.data ?? []).reduce((n, o) => n + o.amount_inr, 0),
    paidOrders: paid.data?.length ?? 0,
    customers: customers.count ?? 0,
    scripts: scripts.count ?? 0,
    openRequests: reqs.count ?? 0,
    reviewOrders: review.count ?? 0,
  };
}
