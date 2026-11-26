import { NextResponse } from "next/server";
import { isLive } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { SCRIPTS } from "@/lib/catalog/sample-data";
import { buildDocx, buildPdf, docxFileName, pdfFileName, type DocMeta } from "@/lib/documents";
import { formatDuration } from "@/lib/format";

export const runtime = "nodejs";

function fileResponse(buf: Buffer, format: "pdf" | "docx", title: string) {
  const name = format === "pdf" ? pdfFileName(title) : docxFileName(title);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="script.${format}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ scriptId: string }> }) {
  const { scriptId } = await ctx.params;
  const format = new URL(req.url).searchParams.get("format") === "docx" ? "docx" : "pdf";
  if (!/^[0-9a-f-]{36}$/i.test(scriptId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ── DEMO MODE: no accounts exist, so we only ever deliver the FREE preview, clearly watermarked.
  if (!isLive) {
    const s = SCRIPTS.find((x) => x.id === scriptId);
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const meta: DocMeta = {
      title: s.title, subtitle: s.subtitle, language: s.language, format: s.format,
      durationLabel: formatDuration(s.durationMinutes), wordCount: s.wordCount,
      licenseLine: "DEMO FILE · Not licensed for use",
      watermark: "DEMO MODE: this file contains only the free preview. The full script is delivered after a real purchase.",
    };
    const body = `${s.preview}\n\n## [ … ] FULL SCRIPT\n(The remaining script is delivered only after a verified purchase.)`;
    return fileResponse(format === "pdf" ? await buildPdf(meta, body) : await buildDocx(meta, body), format, s.title);
  }

  // ── LIVE MODE
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const sb = createAdminClient();
  const { data: purchase } = await sb
    .from("purchases")
    .select("license, order_id")
    .eq("user_id", user.id)
    .eq("script_id", scriptId)
    .maybeSingle();
  if (!purchase && user.role !== "admin") return NextResponse.json({ error: "You have not purchased this script" }, { status: 403 });

  const [{ data: script }, { data: content }] = await Promise.all([
    sb.from("scripts").select("title, subtitle, language, format, duration_minutes, word_count").eq("id", scriptId).single(),
    sb.from("script_contents").select("body, pdf_path, docx_path").eq("script_id", scriptId).single(),
  ]);
  if (!script || !content) return NextResponse.json({ error: "File unavailable" }, { status: 404 });

  await sb.from("download_events").insert({ user_id: user.id, script_id: scriptId, format });

  // Prefer the author's uploaded file: hand out a 60-second signed URL to the private bucket.
  const uploaded = format === "pdf" ? content.pdf_path : content.docx_path;
  if (uploaded) {
    const name = format === "pdf" ? pdfFileName(script.title) : docxFileName(script.title);
    const { data: signed } = await sb.storage.from("script-files").createSignedUrl(uploaded, 60, { download: name });
    if (signed?.signedUrl) return NextResponse.redirect(signed.signedUrl, 303);
  }

  const licenseLine = purchase
    ? `Licensed to ${user.email} · ${purchase.license === "exclusive" ? "Exclusive" : "Standard"} licence · Order ${String(purchase.order_id).slice(0, 8).toUpperCase()}`
    : `Admin copy · ${user.email}`;
  const meta: DocMeta = {
    title: script.title, subtitle: script.subtitle, language: script.language, format: script.format,
    durationLabel: formatDuration(Number(script.duration_minutes)), wordCount: script.word_count, licenseLine,
  };
  const buf = format === "pdf" ? await buildPdf(meta, content.body) : await buildDocx(meta, content.body);
  return fileResponse(buf, format, script.title);
}
