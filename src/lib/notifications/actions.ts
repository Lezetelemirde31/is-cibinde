"use server";

import { requireUser } from "@/lib/auth";
import { markAllRead } from "./service";

export async function markAllNotificationsReadAction(): Promise<{ ok: boolean }> {
  await requireUser();
  await markAllRead();
  // The client calls router.refresh() afterwards to re-render the navbar bell.
  return { ok: true };
}
