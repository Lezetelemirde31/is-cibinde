import "server-only";
import { apiFetch } from "@/lib/api-client";

export type CandidateStats = { apps: number; saved: number; active: number };
export type EmployerStats = { hasCompany: boolean; openJobs: number; totalApps: number };
export type StaffStats = { pendingJobs: number; pendingCompanies: number; totalUsers: number };

export type DashboardStats =
  | { role: "job_seeker"; data: CandidateStats }
  | { role: "employer"; data: EmployerStats }
  | { role: "admin"; data: StaffStats }
  | { role: "moderator"; data: StaffStats };

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch("/dashboard/stats");
}
