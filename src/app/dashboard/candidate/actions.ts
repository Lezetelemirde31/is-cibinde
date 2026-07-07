"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import { saveAvatarUrl, saveCvUrl, updateProfile } from "@/lib/candidate/service";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Ad-soyad daxil edin").max(160),
  headline: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(32).optional(),
  city: z.string().trim().max(120).optional(),
  about: z.string().trim().max(3000).optional(),
  skills: z.string().trim().max(500).optional(),
  openToWork: z.coerce.boolean().optional()
});

export type ProfileState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  await requireRole(["job_seeker"]);
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { fieldErrors };
  }

  try {
    await updateProfile(parsed.data);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Xəta baş verdi" };
  }

  revalidatePath("/dashboard/candidate/profile");
  return { ok: true };
}

export async function saveCvUrlAction(url: string): Promise<ProfileState> {
  await requireRole(["job_seeker"]);
  if (!/^https?:\/\//.test(url)) return { error: "Yanlış URL" };
  await saveCvUrl(url);
  revalidatePath("/dashboard/candidate/profile");
  return { ok: true };
}

export async function saveAvatarUrlAction(url: string): Promise<ProfileState> {
  await requireRole(["job_seeker"]);
  if (!/^https?:\/\//.test(url)) return { error: "Yanlış URL" };
  await saveAvatarUrl(url);
  revalidatePath("/dashboard/candidate/profile");
  return { ok: true };
}
