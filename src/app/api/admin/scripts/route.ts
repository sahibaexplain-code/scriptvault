import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isLive } from "@/lib/env";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseScriptForm, toRow, uploadFiles } from "@/lib/admin-scripts";

export async function POST(req: Request) {
  if (!isLive) return NextResponse.json({ error: "Demo mode: connect Supabase to save changes." }, { status: 503 });
  if (!(await getAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const fd = await req.formData();
  const parsed = parseScriptForm(fd);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return NextResponse.json({ error: `${i?.path.join(".")}: ${i?.message}` }, { status: 400 });
  }
  const sb = createAdminClient();
  const { data: script, error } = await sb.from("scripts").insert(toRow(parsed.data)).select("id, slug").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already used" : error.message }, { status: 400 });

  try {
    const { contentPatch, thumbnailUrl } = await uploadFiles(sb, script.id, fd);
    await sb.from("script_contents").insert({ script_id: script.id, body: parsed.data.body ?? "", ...contentPatch });
    if (thumbnailUrl) await sb.from("scripts").update({ thumbnail_url: thumbnailUrl }).eq("id", script.id);
  } catch (e) {
    return NextResponse.json({ error: `Saved, but file upload failed: ${(e as Error).message}`, id: script.id }, { status: 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id: script.id });
}
