import { NextResponse } from "next/server";
import { z } from "zod";
import { isLive } from "@/lib/env";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ status: z.enum(["new", "quoted", "in_progress", "delivered", "closed"]) });

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isLive) return NextResponse.json({ error: "Demo mode" }, { status: 503 });
  if (!(await getAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { id } = await ctx.params;
  const { error } = await createAdminClient().from("custom_requests").update({ status: parsed.data.status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
