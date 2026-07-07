import "server-only";
import { apiFetch } from "@/lib/api-client";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export async function listNotifications(limit = 30): Promise<NotificationRow[]> {
  return apiFetch(`/notifications?limit=${limit}`);
}

export async function unreadCount(): Promise<number> {
  const res = await apiFetch<{ count: number }>("/notifications/unread-count");
  return res.count;
}

export async function markAllRead(): Promise<void> {
  await apiFetch("/notifications/read-all", { method: "POST" });
}
