import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { apiFetch, ApiError } from "@/lib/api-client";

export type User = {
  id: string;
  email: string;
  role: "job_seeker" | "employer" | "moderator" | "admin";
  status: "active" | "suspended" | "pending_verification";
  preferredLocale: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
};

export type Role = User["role"];

/**
 * Returns the local application user for the signed-in Clerk session. The
 * backend provisions the row just-in-time on first sight of a `clerk_id`.
 * Returns null when there is no authenticated session.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    return await apiFetch<User>("/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

/** Redirect to sign-in if not authenticated; returns the user otherwise. */
export async function requireUser(returnTo = "/dashboard"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Require one of the given roles; falls back to the dashboard otherwise. */
export async function requireRole(roles: Role[], returnTo = "/dashboard"): Promise<User> {
  const user = await requireUser(returnTo);
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}

export function isEmployer(user: User | null): boolean {
  return user?.role === "employer";
}

export function isStaff(user: User | null): boolean {
  return user?.role === "admin" || user?.role === "moderator";
}
