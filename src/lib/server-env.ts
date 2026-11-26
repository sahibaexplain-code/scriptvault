import "server-only";

/** Secrets. This module throws at build time if imported into a client component. */
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export function requireSecret(name: string, value: string): string {
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}
