import "server-only";
import { apiFetch, qs } from "@/lib/api-client";

export type CandidateFilters = { q?: string; city?: string; page?: number; pageSize?: number };

export type CandidateSearchRow = {
  userId: string;
  fullName: string;
  headline: string | null;
  city: string | null;
  skills: string[];
  experienceLevel: string | null;
  email: string;
  cvUrl: string | null;
};

export async function searchCandidates(filters: CandidateFilters): Promise<CandidateSearchRow[]> {
  return apiFetch(`/candidates${qs({ q: filters.q, city: filters.city, page: filters.page })}`);
}

export async function savedCandidateIds(): Promise<Set<string>> {
  const ids = await apiFetch<string[]>("/candidates/saved-ids");
  return new Set(ids);
}

export async function toggleSaveCandidate(candidateId: string): Promise<{ saved: boolean }> {
  return apiFetch(`/candidates/${candidateId}/save`, { method: "POST" });
}
