import "server-only";
import { apiFetch } from "@/lib/api-client";

export async function hasApplied(jobId: string): Promise<boolean> {
  const res = await apiFetch<{ applied: boolean }>(`/jobs/${jobId}/has-applied`);
  return res.applied;
}

export async function applyToJob(
  jobId: string,
  coverLetter?: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    await apiFetch(`/jobs/${jobId}/apply`, { method: "POST", body: { coverLetter } });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return { ok: false, reason: message };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<{ ok: boolean }> {
  return apiFetch(`/applications/${applicationId}/status`, { method: "PATCH", body: { status } });
}
