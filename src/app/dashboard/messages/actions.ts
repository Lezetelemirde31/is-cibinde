"use server";

import { redirect } from "next/navigation";
import { requireUser, requireRole } from "@/lib/auth";
import { getConversationThread, sendMessage, startConversation, type MessageRow } from "@/lib/messaging/service";
import { ApiError } from "@/lib/api-client";

export async function startConversationAction(candidateId: string, jobId?: string) {
  await requireRole(["employer"]);
  const conv = await startConversation(candidateId, jobId);
  redirect(`/dashboard/messages/${conv.id}`);
}

/** Fetch the latest messages for a conversation (client polls this for live updates). */
export async function getThreadMessagesAction(conversationId: string): Promise<MessageRow[] | null> {
  await requireUser();
  const data = await getConversationThread(conversationId);
  return data?.messages ?? null;
}

/** Send a message and report the result (called imperatively by the composer). */
export async function postMessageAction(
  conversationId: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  await requireUser();
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Mesaj boş ola bilməz" };
  if (trimmed.length > 4000) return { ok: false, error: "Mesaj çox uzundur" };

  try {
    await sendMessage(conversationId, trimmed);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof ApiError ? err.message : "Mesaj göndərilmədi" };
  }
}
