import "server-only";
import { apiFetch } from "@/lib/api-client";

export type AdminJobRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  companyName: string;
};

export async function listJobsForModeration(): Promise<AdminJobRow[]> {
  return apiFetch("/admin/jobs");
}

export async function moderateJob(
  jobId: string,
  status: "active" | "rejected" | "closed"
): Promise<{ ok: boolean; error?: string }> {
  return apiFetch(`/admin/jobs/${jobId}/moderate`, { method: "POST", body: { status } });
}

export type AdminCompanyRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  industry: string | null;
  createdAt: string;
};

export async function listCompaniesForModeration(): Promise<AdminCompanyRow[]> {
  return apiFetch("/admin/companies");
}

export async function setCompanyStatus(
  companyId: string,
  status: "verified" | "rejected"
): Promise<{ ok: boolean; error?: string }> {
  return apiFetch(`/admin/companies/${companyId}/status`, { method: "POST", body: { status } });
}

export type AdminUserRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export async function listUsersForAdmin(): Promise<AdminUserRow[]> {
  return apiFetch("/admin/users");
}

export async function setUserRole(
  userId: string,
  role: "job_seeker" | "employer" | "moderator" | "admin"
): Promise<{ ok: boolean; error?: string }> {
  return apiFetch(`/admin/users/${userId}/role`, { method: "POST", body: { role } });
}

export async function toggleUserStatus(userId: string): Promise<{ ok: boolean; error?: string }> {
  return apiFetch(`/admin/users/${userId}/toggle-status`, { method: "POST" });
}
