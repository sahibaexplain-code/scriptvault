import { NextResponse } from "next/server";
import { isLive } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (isLive) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", req.url), 303);
}
