import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Refund Policy" };

export default function Refunds() {
  return (
    <LegalPage title="Refund Policy" updated="26 November 2026">
      <p>Scripts are digital products delivered instantly, so we can’t offer “change of mind” refunds once a file has been downloaded. That’s why every script has a free preview. But if something is wrong, we will put it right.</p>
      <h2>You’re entitled to a full refund if</h2>
      <ul>
        <li>You were charged but the script never appeared in your dashboard, and we can’t fix it within 48 hours.</li>
        <li>The file is corrupted or materially different from its description (language, duration, or word count off by more than 20%).</li>
        <li>You accidentally bought the same script twice.</li>
        <li>You paid for an exclusive licence that another customer secured first.</li>
        <li>You haven’t downloaded the script yet and ask within 7 days of purchase.</li>
      </ul>
      <h2>Custom scripts</h2>
      <p>If we can’t deliver by the agreed date, you get a full refund. After you approve the first draft, payments for completed work are non-refundable, but revisions included in your quote still apply.</p>
      <h2>How to request one</h2>
      <p>Use the <Link href="/contact">contact form</Link> (subject: “Refund request”) within 7 days of purchase, and include your email and the Razorpay payment ID from your dashboard. We reply within one working day.</p>
      <h2>Timelines</h2>
      <p>Approved refunds are issued to the original payment method through Razorpay. Banks usually credit them within 5–7 working days. Refunded scripts are removed from your library.</p>
    </LegalPage>
  );
}
