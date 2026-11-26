import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPage() {
  return (
    <section className="container-x max-w-md py-20">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Set a new password</h1>
      <ResetPasswordForm />
    </section>
  );
}
