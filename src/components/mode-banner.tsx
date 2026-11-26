import { isDemo, isLive, paymentsEnabled, razorpayTestMode } from "@/lib/env";

/** Always tells visitors whether money is real. Never hidden in demo or test mode. */
export function ModeBanner() {
  let text: React.ReactNode = null;
  if (isDemo)
    text = (<><b className="font-semibold text-white">Demo mode</b> · Sample catalogue, simulated checkout. No accounts are created and no payments are taken.</>);
  else if (isLive && !paymentsEnabled)
    text = (<><b className="font-semibold text-white">Payments offline</b> · Razorpay keys are not configured yet. Browsing and accounts work.</>);
  else if (razorpayTestMode)
    text = (<><b className="font-semibold text-white">Test payments</b> · Razorpay is in test mode. Use test cards; no real money moves.</>);
  if (!text) return null;
  return (
    <div className="relative z-[60] border-b border-volt/30 bg-gradient-to-r from-volt-lo/40 via-volt/25 to-volt-lo/40 px-4 py-1.5 text-center text-[12px] text-white/80">
      {text}
    </div>
  );
}
