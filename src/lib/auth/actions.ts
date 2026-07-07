"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api-client";
import { getCurrentUser } from "./index";

const onboardingSchema = z
  .object({
    role: z.enum(["job_seeker", "employer"]),
    fullName: z.string().trim().min(2, "Ad-soyad daxil edin").max(160),
    companyName: z.string().trim().max(200).optional()
  })
  .refine((d) => d.role !== "employer" || (d.companyName && d.companyName.length >= 2), {
    message: "Şirkət adı daxil edin",
    path: ["companyName"]
  });

export type OnboardingState = { fieldErrors?: Record<string, string>; error?: string };

export async function completeOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sessiya tapılmadı. Yenidən daxil olun." };
  if (user.onboardingCompletedAt) redirect("/dashboard");

  const parsed = onboardingSchema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName") || undefined
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  try {
    await apiFetch("/onboarding", { method: "POST", body: parsed.data });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    throw err;
  }

  redirect("/dashboard");
}
