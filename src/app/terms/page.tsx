import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="26 November 2026">
      <p>These terms govern your use of ScriptVault, operated by [Business legal name], [registered address]. By creating an account or buying a script you agree to them.</p>
      <h2>1. What you’re buying</h2>
      <p>ScriptVault sells licences to use written scripts. You are not buying the copyright itself; you are buying the right to use the script as described below. All prices are in Indian Rupees and include applicable taxes unless stated otherwise.</p>
      <h2>2. Standard licence</h2>
      <ul>
        <li>Use the script to produce videos, reels, podcasts or other audio-visual content published on channels and accounts you own or manage.</li>
        <li>Monetise that content (ads, sponsorships, memberships).</li>
        <li>Edit, shorten, translate or adapt the script.</li>
        <li>The same script may be licensed to other creators.</li>
      </ul>
      <h2>3. Exclusive licence</h2>
      <ul>
        <li>Everything in the Standard licence.</li>
        <li>Offered only on scripts that have never been sold. After your purchase we permanently remove the script from sale and will not license it to anyone else.</li>
        <li>If two customers pay for the same exclusive licence at the same moment, the first verified payment wins and the other customer receives a full refund.</li>
      </ul>
      <h2>4. What you may not do</h2>
      <ul>
        <li>Resell, share, publish or distribute the script text itself, in whole or in part, as text.</li>
        <li>Upload the files to other script marketplaces or AI training datasets.</li>
        <li>Share your account or download links with others.</li>
      </ul>
      <h2>5. Accuracy</h2>
      <p>We research factual scripts carefully, but you are responsible for the content you publish. Finance and health scripts are educational and not professional advice; keep any disclaimers included in the script.</p>
      <h2>6. Payments</h2>
      <p>Payments are processed by Razorpay. Your purchase is confirmed only after our server verifies the payment with Razorpay. Refunds are covered by our <Link href="/refund-policy">Refund Policy</Link>.</p>
      <h2>7. Custom scripts</h2>
      <p>Custom work is quoted individually. Quotes state the deliverable, timeline, revision rounds and licence. Unless agreed otherwise, custom scripts are delivered under an Exclusive licence.</p>
      <h2>8. Liability</h2>
      <p>To the extent permitted by law, our total liability for any claim relating to a purchase is limited to the amount you paid for it.</p>
      <h2>9. Governing law</h2>
      <p>These terms are governed by the laws of India. Courts at [City] have exclusive jurisdiction.</p>
    </LegalPage>
  );
}
