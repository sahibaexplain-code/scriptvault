import { NextResponse } from "next/server";
import { z } from "zod";
import { isLive } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  contentType: z.enum(["YouTube Long-form", "Reels / Shorts", "Documentary", "Other"]),
  language: z.enum(["Hindi", "Hinglish", "English"]),
  duration: z.string().trim().min(1).max(50),
  topic: z.string().trim().min(5).max(300),
  details: z.string().trim().max(4000).default(""),
  budget: z.string().trim().max(50).optional(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  license: z.enum(["exclusive", "standard"]).default("exclusive"),
  website: z.string().max(0).optional(), // honeypot: real users never fill this
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form" }, { status: 400 });
  if (!isLive) return NextResponse.json({ ok: true, demo: true });

  const d = parsed.data;
  const user = await getSessionUser();
  const { error } = await createAdminClient().from("custom_requests").insert({
    user_id: user?.id ?? null, name: d.name, email: d.email, content_type: d.contentType, language: d.language,
    duration: d.duration, topic: d.topic, details: d.details, budget: d.budget || null, deadline: d.deadline || null, license: d.license,
  });
  if (error) return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
