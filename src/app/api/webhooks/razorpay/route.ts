import { NextResponse } from "next/server";
import { isLive } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";

/**
 * Safety net for when the customer closes the tab before the browser callback runs.
 * Configure in Razorpay Dashboard → Webhooks with events: payment.captured, payment.failed.
 */
export async function POST(req: Request) {
  if (!isLive) return NextResponse.json({ ok: true });
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; status: string } } };
  };
  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id) return NextResponse.json({ ok: true });

  const sb = createAdminClient();
  const { data: order } = await sb.from("orders").select("id, amount_inr, status").eq("razorpay_order_id", payment.order_id).maybeSingle();
  if (!order) return NextResponse.json({ ok: true });

  if (event.event === "payment.captured" && payment.amount === order.amount_inr * 100) {
    const { error } = await sb.rpc("fulfil_order", { p_order_id: order.id, p_payment_id: payment.id });
    if (error) return NextResponse.json({ error: "fulfilment failed" }, { status: 500 }); // Razorpay retries
  } else if (event.event === "payment.failed" && order.status === "created") {
    await sb.from("orders").update({ status: "failed" }).eq("id", order.id).eq("status", "created");
  }
  return NextResponse.json({ ok: true });
}
