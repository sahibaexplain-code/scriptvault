/**
 * Public configuration flags. Safe to import from client components:
 * only NEXT_PUBLIC_* variables are read here.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

/** Live mode = Supabase is connected. Without it the whole site runs on sample data. */
export const isLive = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isDemo = !isLive;

export const paymentsEnabled = isLive && Boolean(RAZORPAY_KEY_ID);
export const razorpayTestMode = RAZORPAY_KEY_ID.startsWith("rzp_test_");
