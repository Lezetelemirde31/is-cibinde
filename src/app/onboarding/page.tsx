import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Profili tamamla" };

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  if (user.onboardingCompletedAt) redirect("/dashboard");

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Az qalıb</h1>
          <p className="mt-1 text-sm text-muted">
            Hesabını qur ki, sənə uyğun təcrübə göstərək.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
