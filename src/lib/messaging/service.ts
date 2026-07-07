import "server-only";
import { ApiError, apiFetch } from "@/lib/api-client";

export type ConversationRow = {
  id: string;
  lastMessageAt: string;
  unread: number;
  otherName: string;
};

export async function listConversations(): Promise<ConversationRow[]> {
  return apiFetch("/conversations");
}

export type MessageRow = { id: string; senderId: string; body: string; createdAt: string };

export async function getConversationThread(
  conversationId: string
): Promise<{ conversationId: string; messages: MessageRow[] } | null> {
  try {
    return await apiFetch(`/conversations/${conversationId}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function startConversation(candidateId: string, jobId?: string | null): Promise<{ id: string }> {
  return apiFetch("/conversations", { method: "POST", body: { candidateId, jobId: jobId ?? undefined } });
}

export async function sendMessage(conversationId: string, body: string): Promise<{ ok: boolean }> {
  return apiFetch(`/conversations/${conversationId}/messages`, { method: "POST", body: { body } });
}
