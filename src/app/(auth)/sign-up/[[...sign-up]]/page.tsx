import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Qeydiyyat",
  description: "İş Cibində platformasında iş axtaran və ya işəgötürən kimi hesab yarat."
};

export default function SignUpPage() {
  return (
    <div className="w-full">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Hesab yarat</h1>
      <p className="mb-6 text-sm text-muted">Bir neçə saniyədə başla.</p>
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
