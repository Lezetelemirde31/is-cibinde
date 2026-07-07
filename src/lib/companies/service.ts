import "server-only";
import { ApiError, apiFetch, qs } from "@/lib/api-client";
import type { CompanySummary, JobListItem } from "@/lib/jobs/service";

export type CompanyListItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  industry: string | null;
  city: string | null;
  openJobs: number;
};

export async function listCompanies(opts: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: CompanyListItem[]; page: number; pageSize: number }> {
  return apiFetch(`/companies${qs({ q: opts.q, page: opts.page, pageSize: opts.pageSize })}`, {
    auth: false
  });
}

export async function getCompanyBySlug(
  slug: string
): Promise<{ company: CompanySummary; openJobs: JobListItem[] } | null> {
  try {
    return await apiFetch(`/companies/${slug}`, { auth: false });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function companyForOwner(): Promise<CompanySummary | null> {
  return apiFetch<CompanySummary | null>("/companies/mine");
}
