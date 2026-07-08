import "server-only";
import { ApiError, apiFetch, qs } from "@/lib/api-client";

export type JobFilters = {
  q?: string;
  categoryId?: string;
  employmentType?: string;
  city?: string;
  remote?: boolean;
  experienceLevel?: string;
  salaryMin?: number;
  page?: number;
  pageSize?: number;
};

export type JobListItem = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryHidden: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  companyName: string;
  companySlug: string;
  companyLogo: string | null;
};

export type CompanySummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  industry: string | null;
  sizeRange: string | null;
  city: string | null;
  about: string | null;
  status: string;
};

export type CategorySummary = {
  id: string;
  slug: string;
  nameAz: string;
  nameRu: string | null;
  nameEn: string | null;
};

export type JobDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  employmentType: string;
  experienceLevel: string | null;
  city: string | null;
  isRemote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryHidden: boolean;
  skills: string[];
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  company: CompanySummary;
  category: CategorySummary | null;
};

export async function listJobs(filters: JobFilters): Promise<{
  items: JobListItem[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return apiFetch(
    `/jobs${qs({
      q: filters.q,
      categoryId: filters.categoryId,
      employmentType: filters.employmentType,
      city: filters.city,
      remote: filters.remote,
      experienceLevel: filters.experienceLevel,
      salaryMin: filters.salaryMin,
      page: filters.page,
      pageSize: filters.pageSize
    })}`,
    { auth: false }
  );
}

export async function latestJobs(limit = 6): Promise<JobListItem[]> {
  return apiFetch(`/jobs/latest${qs({ limit })}`, { auth: false, next: { revalidate: 120 } });
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  try {
    return await apiFetch<JobDetail>(`/jobs/${slug}`, { auth: false });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function incrementJobView(jobId: string): Promise<void> {
  await apiFetch(`/jobs/${jobId}/view`, { method: "POST", auth: false });
}

export type CreateJobInput = {
  title: string;
  categoryId?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  employmentType: string;
  experienceLevel?: string;
  city?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryHidden?: boolean;
  skills?: string;
};

export async function createJob(input: CreateJobInput): Promise<JobDetail> {
  return apiFetch("/jobs", { method: "POST", body: input });
}

export async function changeJobStatus(jobId: string, close: boolean): Promise<{ ok: boolean }> {
  return apiFetch(`/jobs/${jobId}/status`, { method: "PATCH", body: { close } });
}

export async function getJobForEdit(jobId: string): Promise<JobDetail | null> {
  try {
    return await apiFetch<JobDetail>(`/jobs/${jobId}/edit`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updateJob(jobId: string, input: CreateJobInput): Promise<JobDetail> {
  return apiFetch(`/jobs/${jobId}`, { method: "PATCH", body: input });
}

export async function toggleSaveJob(jobId: string): Promise<{ saved: boolean }> {
  return apiFetch(`/jobs/${jobId}/save`, { method: "POST" });
}
