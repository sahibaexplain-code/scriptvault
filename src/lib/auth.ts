import "server-only";
import { redirect } from "next/navigation";
import { isLive } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  role: "customer" | "admin";
}

/** Returns the signed-in user (verified with Supabase Auth), or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isLive) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? null,
    role: profile?.role === "admin" ? "admin" : "customer",
  };
}

export async function requireUser(next = "/dashboard") {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** For API routes: returns the admin user or null (caller responds 403). */
export async function getAdminUser() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
