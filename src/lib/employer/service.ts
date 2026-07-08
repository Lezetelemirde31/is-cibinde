import "server-only";
import { apiFetch } from "@/lib/api-client";

export type EmployerJobRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  employmentType: string;
  applicationCount: number;
  createdAt: string;
};

export async function myJobs(): Promise<EmployerJobRow[]> {
  return apiFetch("/employer/jobs");
}

export type EmployerApplicationRow = {
  id: string;
  status: string;
  createdAt: string;
  coverLetter: string | null;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string | null;
  candidateHeadline: string | null;
  candidateCity: string | null;
  candidateEmail: string;
};

export async function myApplications(): Promise<EmployerApplicationRow[]> {
  return apiFetch("/employer/applications");
}

export type EmployerAnalytics = {
  totals: { activeJobs: number; totalViews: number; totalApplications: number };
  jobs: { id: string; title: string; slug: string; status: string; views: number; applications: number }[];
};

export async function getAnalytics(): Promise<EmployerAnalytics> {
  return apiFetch("/employer/analytics");
}
