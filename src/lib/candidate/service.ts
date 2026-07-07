import "server-only";
import { apiFetch } from "@/lib/api-client";
import type { JobListItem } from "@/lib/jobs/service";

export type CandidateApplicationRow = {
  id: string;
  status: string;
  createdAt: string;
  jobTitle: string;
  jobSlug: string;
  companyName: string;
};

export async function myApplications(): Promise<CandidateApplicationRow[]> {
  return apiFetch("/candidate/applications");
}

export async function mySavedJobs(): Promise<JobListItem[]> {
  return apiFetch("/candidate/saved-jobs");
}

export type CandidateProfile = {
  fullName: string;
  headline: string | null;
  phone: string | null;
  city: string | null;
  about: string | null;
  skills: string[];
  openToWork: boolean;
  cvUrl: string | null;
  avatarUrl: string | null;
};

export async function myProfile(): Promise<CandidateProfile | null> {
  return apiFetch<CandidateProfile | null>("/candidate/profile");
}

export type ProfileInput = {
  fullName: string;
  headline?: string;
  phone?: string;
  city?: string;
  about?: string;
  skills?: string;
  openToWork?: boolean;
};

export async function updateProfile(input: ProfileInput): Promise<CandidateProfile> {
  return apiFetch("/candidate/profile", { method: "PATCH", body: input });
}

export async function saveCvUrl(url: string): Promise<CandidateProfile> {
  return apiFetch("/candidate/profile/cv-url", { method: "PATCH", body: { url } });
}

export async function saveAvatarUrl(url: string): Promise<CandidateProfile> {
  return apiFetch("/candidate/profile/avatar-url", { method: "PATCH", body: { url } });
}
