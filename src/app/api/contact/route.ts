import { NextResponse } from "next/server";
import { z } from "zod";
import { isLive } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form" }, { status: 400 });
  if (!isLive) return NextResponse.json({ ok: true, demo: true });
  const { website: _hp, ...row } = parsed.data;
  const { error } = await createAdminClient().from("contact_messages").insert(row);
  if (error) return NextResponse.json({ error: "Could not send. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
