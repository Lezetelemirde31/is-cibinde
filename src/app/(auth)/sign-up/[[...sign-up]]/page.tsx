import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Qeydiyyat",
  description: "İş Cibində platformasında iş axtaran və ya işəgötürən kimi hesab yarat."
};

export default async function SignUpPage() {
  const dict = await getDictionary();
  return (
    <div className="w-full">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">{dict.auth.signUpTitle}</h1>
      <p className="mb-6 text-sm text-muted">{dict.auth.signUpSubtitle}</p>
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
