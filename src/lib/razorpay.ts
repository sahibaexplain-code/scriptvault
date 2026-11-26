import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { RAZORPAY_KEY_ID } from "@/lib/env";
import { RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, requireSecret } from "@/lib/server-env";

export function razorpayClient() {
  return new Razorpay({
    key_id: requireSecret("NEXT_PUBLIC_RAZORPAY_KEY_ID", RAZORPAY_KEY_ID),
    key_secret: requireSecret("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET),
  });
}

function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Checkout callback signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", requireSecret("RAZORPAY_KEY_SECRET", RAZORPAY_KEY_SECRET))
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw request body, webhook_secret). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", requireSecret("RAZORPAY_WEBHOOK_SECRET", RAZORPAY_WEBHOOK_SECRET))
    .update(rawBody)
    .digest("hex");
  return safeEqualHex(expected, signature);
}
