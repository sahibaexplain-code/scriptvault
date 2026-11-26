import { NextResponse } from "next/server";
import { RAZORPAY_KEY_ID, paymentsEnabled } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PricingError, cartSchema, priceCart } from "@/lib/pricing";
import { razorpayClient } from "@/lib/razorpay";

export async function POST(req: Request) {
  if (!paymentsEnabled) return NextResponse.json({ error: "Payments are not configured on this site." }, { status: 503 });

  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });

  const parsed = cartSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid cart" }, { status: 400 });

  const sb = createAdminClient();
  try {
    const { lines, totalInr } = await priceCart(sb, parsed.data, user.id);

    const { data: order, error } = await sb
      .from("orders")
      .insert({ user_id: user.id, amount_inr: totalInr, status: "created" })
      .select("id")
      .single();
    if (error) throw error;

    const { error: itemsErr } = await sb.from("order_items").insert(
      lines.map((l) => ({ order_id: order.id, script_id: l.scriptId, bundle_id: l.bundleId, title: l.title, license: l.license, price_inr: l.priceInr }))
    );
    if (itemsErr) throw itemsErr;

    const rzpOrder = await razorpayClient().orders.create({
      amount: totalInr * 100, // paise
      currency: "INR",
      receipt: order.id.slice(0, 40),
      notes: { order_id: order.id, user_id: user.id },
    });
    await sb.from("orders").update({ razorpay_order_id: rzpOrder.id }).eq("id", order.id);

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      prefill: { email: user.email, name: user.fullName ?? "" },
    });
  } catch (e) {
    if (e instanceof PricingError) return NextResponse.json({ error: e.message }, { status: 409 });
    console.error("create-order failed", e);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
