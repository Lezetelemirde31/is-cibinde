"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { applyToJob } from "@/lib/applications/service";
import { toggleSaveJob as toggleSaveJobApi } from "@/lib/jobs/service";

export type ApplyState = { ok?: boolean; error?: string };

export async function applyAction(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Müraciət etmək üçün daxil olun." };
  if (user.role !== "job_seeker") {
    return { error: "Yalnız iş axtaranlar müraciət edə bilər." };
  }

  const jobId = String(formData.get("jobId") ?? "");
  const coverLetter = String(formData.get("coverLetter") ?? "").trim() || undefined;
  if (!jobId) return { error: "Vakansiya tapılmadı." };

  const result = await applyToJob(jobId, coverLetter);
  if (!result.ok) return { error: result.reason };

  revalidatePath("/dashboard/candidate/applications");
  return { ok: true };
}

export async function toggleSaveJob(jobId: string): Promise<{ saved: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Daxil olun." };

  const result = await toggleSaveJobApi(jobId);
  revalidatePath("/dashboard/candidate/saved");
  return result;
}
