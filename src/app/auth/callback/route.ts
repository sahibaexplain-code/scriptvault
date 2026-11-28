import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/dashboard";

  const next =
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//") &&
    !nextParam.includes("\\")
      ? nextParam
      : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, SITE_URL));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=link", SITE_URL)
  );
}
