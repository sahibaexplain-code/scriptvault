import { NextResponse } from "next/server";
import { z } from "zod";
import { paymentsEnabled } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { razorpayClient, verifyPaymentSignature } from "@/lib/razorpay";

const schema = z.object({
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(256),
});

export async function POST(req: Request) {
  if (!paymentsEnabled) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // 1. Cryptographic proof that Razorpay issued this payment for this order.
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const sb = createAdminClient();
  const { data: order } = await sb
    .from("orders")
    .select("id, user_id, amount_inr, status")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();
  if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // 2. Ask Razorpay directly that the money moved, for the right amount.
  const payment = await razorpayClient().payments.fetch(razorpay_payment_id);
  if (payment.order_id !== razorpay_order_id || Number(payment.amount) !== order.amount_inr * 100 || !["captured", "authorized"].includes(payment.status)) {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  // 3. Grant access atomically. Idempotent, so the webhook can call it too.
  const { data: result, error } = await sb.rpc("fulfil_order", { p_order_id: order.id, p_payment_id: razorpay_payment_id });
  if (error) {
    console.error("fulfil_order failed", error);
    return NextResponse.json({ error: "Payment received but fulfilment failed. Contact support with your payment ID." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, orderId: order.id, status: result === "review" ? "review" : "paid" });
}
