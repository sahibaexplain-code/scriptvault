import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isLive } from "@/lib/env";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseScriptForm, toRow, uploadFiles } from "@/lib/admin-scripts";

type Ctx = { params: Promise<{ id: string }> };

async function guard() {
  if (!isLive) return NextResponse.json({ error: "Demo mode: connect Supabase to save changes." }, { status: 503 });
  if (!(await getAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await ctx.params;
  const fd = await req.formData();
  const parsed = parseScriptForm(fd);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return NextResponse.json({ error: `${i?.path.join(".")}: ${i?.message}` }, { status: 400 });
  }
  const sb = createAdminClient();
  const { error } = await sb.from("scripts").update(toRow(parsed.data)).eq("id", id);
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already used" : error.message }, { status: 400 });

  try {
    const { contentPatch, thumbnailUrl } = await uploadFiles(sb, id, fd);
    const patch: Record<string, unknown> = { ...contentPatch, updated_at: new Date().toISOString() };
    if (typeof parsed.data.body === "string") patch.body = parsed.data.body;
    await sb.from("script_contents").upsert({ script_id: id, ...patch });
    if (thumbnailUrl) await sb.from("scripts").update({ thumbnail_url: thumbnailUrl }).eq("id", id);
  } catch (e) {
    return NextResponse.json({ error: `Details saved, but file upload failed: ${(e as Error).message}` }, { status: 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await ctx.params;
  const sb = createAdminClient();
  // Never delete something customers have paid for: their downloads would disappear.
  const { count } = await sb.from("purchases").select("id", { count: "exact", head: true }).eq("script_id", id);
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "This script has buyers. Unpublish it instead so they keep access." }, { status: 409 });
  }
  await sb.storage.from("script-files").remove([`${id}/script.pdf`, `${id}/script.docx`]);
  const { error } = await sb.from("scripts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
