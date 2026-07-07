import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = { title: "Daxil ol" };

export default function SignInPage() {
  return (
    <div className="w-full">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Xoş gəldin</h1>
      <p className="mb-6 text-sm text-muted">Hesabına daxil ol və işə davam et.</p>
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
