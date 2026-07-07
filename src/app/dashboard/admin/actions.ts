"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import {
  moderateJob,
  setCompanyStatus,
  setUserRole,
  toggleUserStatus
} from "@/lib/admin/service";

type ModResult = { ok: boolean; error?: string };

export async function moderateJobAction(
  jobId: string,
  status: "active" | "rejected" | "closed"
): Promise<ModResult> {
  await requireRole(["admin", "moderator"]);
  const res = await moderateJob(jobId, status);
  revalidatePath("/dashboard/admin/jobs");
  revalidatePath("/jobs");
  return res;
}

export async function setCompanyStatusAction(
  companyId: string,
  status: "verified" | "rejected"
): Promise<ModResult> {
  await requireRole(["admin", "moderator"]);
  const res = await setCompanyStatus(companyId, status);
  revalidatePath("/dashboard/admin/companies");
  revalidatePath("/companies");
  return res;
}

export async function setUserRoleAction(
  userId: string,
  role: "job_seeker" | "employer" | "moderator" | "admin"
): Promise<ModResult> {
  await requireRole(["admin"]);
  const res = await setUserRole(userId, role);
  revalidatePath("/dashboard/admin/users");
  return res;
}

export async function toggleUserStatusAction(userId: string): Promise<ModResult> {
  await requireRole(["admin"]);
  const res = await toggleUserStatus(userId);
  revalidatePath("/dashboard/admin/users");
  return res;
}
