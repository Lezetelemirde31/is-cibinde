import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { title: "Daxil ol" };

export default async function SignInPage() {
  const dict = await getDictionary();
  return (
    <div className="w-full">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">{dict.auth.signInTitle}</h1>
      <p className="mb-6 text-sm text-muted">{dict.auth.signInSubtitle}</p>
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
