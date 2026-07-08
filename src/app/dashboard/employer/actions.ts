"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import { jobSchema } from "@/lib/validation";
import { createJob, changeJobStatus, updateJob } from "@/lib/jobs/service";
import { updateApplicationStatus } from "@/lib/applications/service";
import { toggleSaveCandidate } from "@/lib/candidates/service";
import { updateMyCompany } from "@/lib/companies/service";
import { z } from "zod";

export type JobFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function createJobAction(
  _prev: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireRole(["employer"]);

  const parsed = jobSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }
  const d = parsed.data;

  try {
    await createJob({
      title: d.title,
      categoryId: d.categoryId || undefined,
      description: d.description,
      responsibilities: d.responsibilities || undefined,
      requirements: d.requirements || undefined,
      employmentType: d.employmentType,
      experienceLevel: d.experienceLevel || undefined,
      city: d.city || undefined,
      isRemote: Boolean(d.isRemote),
      salaryMin: Number.isFinite(d.salaryMin as number) ? (d.salaryMin as number) : undefined,
      salaryMax: Number.isFinite(d.salaryMax as number) ? (d.salaryMax as number) : undefined,
      salaryHidden: Boolean(d.salaryHidden),
      skills: d.skills
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Vakansiya yaradıla bilmədi." };
  }

  revalidatePath("/dashboard/employer/jobs");
  revalidatePath("/jobs");
  return {};
}

export async function updateJobAction(
  jobId: string,
  _prev: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await requireRole(["employer"]);
  const parsed = jobSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { fieldErrors };
  }
  const d = parsed.data;
  try {
    await updateJob(jobId, {
      title: d.title,
      categoryId: d.categoryId || undefined,
      description: d.description,
      responsibilities: d.responsibilities || undefined,
      requirements: d.requirements || undefined,
      employmentType: d.employmentType,
      experienceLevel: d.experienceLevel || undefined,
      city: d.city || undefined,
      isRemote: Boolean(d.isRemote),
      salaryMin: Number.isFinite(d.salaryMin as number) ? (d.salaryMin as number) : undefined,
      salaryMax: Number.isFinite(d.salaryMax as number) ? (d.salaryMax as number) : undefined,
      salaryHidden: Boolean(d.salaryHidden),
      skills: d.skills
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Yadda saxlanılmadı" };
  }
  revalidatePath("/dashboard/employer/jobs");
  revalidatePath("/jobs");
  return {};
}

export async function changeJobStatusAction(jobId: string, close: boolean) {
  await requireRole(["employer"]);
  const res = await changeJobStatus(jobId, close);
  revalidatePath("/dashboard/employer/jobs");
  revalidatePath("/jobs");
  return res;
}

export async function updateApplicationStatusAction(applicationId: string, status: string) {
  await requireRole(["employer"]);
  const res = await updateApplicationStatus(applicationId, status);
  revalidatePath("/dashboard/employer/applications");
  return res;
}

export async function toggleSaveCandidateAction(candidateId: string) {
  await requireRole(["employer"]);
  const res = await toggleSaveCandidate(candidateId);
  revalidatePath("/dashboard/employer/candidates");
  return res;
}

const companySchema = z.object({
  name: z.string().trim().min(2, "Şirkət adı çox qısadır").max(200),
  logoUrl: z.string().trim().max(500).optional(),
  website: z.string().trim().max(300).optional(),
  industry: z.string().trim().max(120).optional(),
  sizeRange: z.string().trim().max(40).optional(),
  city: z.string().trim().max(120).optional(),
  about: z.string().trim().max(3000).optional()
});

export type CompanyFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function updateCompanyAction(
  _prev: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  await requireRole(["employer"]);
  const parsed = companySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { fieldErrors };
  }
  try {
    await updateMyCompany(parsed.data);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Yadda saxlanılmadı" };
  }
  revalidatePath("/dashboard/employer/company");
  revalidatePath("/companies");
  return { ok: true };
}
