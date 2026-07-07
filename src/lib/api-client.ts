import "server-only";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type FetchOpts = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the caller's Clerk session token. Default true. */
  auth?: boolean;
  next?: { revalidate?: number | false; tags?: string[] };
};

function toSnakeCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toSnakeCase);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
        toSnakeCase(v)
      ])
    );
  }
  return value;
}

function toCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamelCase);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase()),
        toCamelCase(v)
      ])
    );
  }
  return value;
}

/** Calls the Python API, forwarding the caller's Clerk session token by default. */
export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (opts.auth !== false) {
    const { getToken } = await auth();
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(toSnakeCase(opts.body)) : undefined,
    cache: opts.next ? undefined : "no-store",
    next: opts.next
  });

  if (!res.ok) {
    let message = res.statusText;
    const data = await res.json().catch(() => null);
    if (data && typeof data.detail === "string") message = data.detail;
    else if (data && data.detail) message = JSON.stringify(data.detail);
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;

  const json = await res.json();
  return toCamelCase(json) as T;
}

export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}
