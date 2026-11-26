import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="26 November 2026">
      <p>This policy explains what personal data [Business legal name] (“ScriptVault”, “we”) collects when you use this website, why, and the choices you have. We process personal data in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
      <h2>What we collect</h2>
      <ul>
        <li><b>Account data:</b> your email address, name (optional) and a securely hashed password, managed by our authentication provider, Supabase.</li>
        <li><b>Order data:</b> what you bought, the licence type, amounts and Razorpay order/payment IDs. We never see or store your card, UPI or bank details; Razorpay processes them directly.</li>
        <li><b>Download logs:</b> which file you downloaded and when, to prevent abuse and help with support.</li>
        <li><b>Messages:</b> anything you send through the contact or custom-script forms.</li>
        <li><b>Technical data:</b> essential cookies that keep you signed in, and your cart stored in your own browser.</li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To create your account, deliver your purchases and show your purchase history.</li>
        <li>To process payments, prevent fraud and meet tax and accounting obligations.</li>
        <li>To answer your questions and deliver custom work you request.</li>
      </ul>
      <p>We do not sell your data and we do not use advertising trackers.</p>
      <h2>Who we share it with</h2>
      <ul>
        <li><b>Razorpay</b> (payment processing), <b>Supabase</b> (database, authentication and file storage) and <b>Vercel</b> (hosting), each only as needed to run the service.</li>
        <li>Authorities, where required by law.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>Account and purchase records are kept while your account is active so you can re-download your scripts, and afterwards for as long as tax law requires (generally 8 years for financial records). Messages are deleted after 24 months.</p>
      <h2>Your rights</h2>
      <p>You can ask us to access, correct or delete your personal data, or withdraw consent, by emailing [privacy@yourdomain]. Deleting your account removes access to your downloads. Our Grievance Officer is [Name], reachable at [email]; we respond within 30 days.</p>
      <h2>Security</h2>
      <p>Paid files are stored privately and are only released through short-lived, signed links after we verify your purchase on our server. Access to our database is restricted by row-level security.</p>
      <h2>Changes</h2>
      <p>We’ll post any changes here and update the date above. Significant changes will be emailed to account holders.</p>
    </LegalPage>
  );
}
