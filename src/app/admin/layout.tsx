import Link from "next/link";
import type { Metadata } from "next";
import { isDemo } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isDemo) {
    const user = await getSessionUser();
    if (user?.role !== "admin") {
      return (
        <section className="container-x max-w-lg py-24 text-center">
          <p className="font-mono text-xs text-subtle">403</p>
          <h1 className="mt-3 text-3xl font-semibold">Admins only</h1>
          <p className="mt-3 text-muted">Your account doesn’t have admin access. See “Make yourself an admin” in the README.</p>
          <Link href="/" className="btn-ghost mt-8">Back home</Link>
        </section>
      );
    }
  }
  return (
    <section className="container-x py-10">
      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber/30 bg-amber/10 px-5 py-3 text-sm text-amber">
          Demo admin: read-only preview with sample data. Connect Supabase and sign in as an admin to upload, edit and price scripts.
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
