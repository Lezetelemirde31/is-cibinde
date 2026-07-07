"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser, requireRole } from "@/lib/auth";
import { sendMessage, startConversation } from "@/lib/messaging/service";
import { ApiError } from "@/lib/api-client";

export async function startConversationAction(candidateId: string, jobId?: string) {
  await requireRole(["employer"]);
  const conv = await startConversation(candidateId, jobId);
  redirect(`/dashboard/messages/${conv.id}`);
}

export type SendState = { error?: string };

export async function sendMessageAction(_prev: SendState, formData: FormData): Promise<SendState> {
  await requireUser();
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId || !body) return { error: "Mesaj boş ola bilməz" };
  if (body.length > 4000) return { error: "Mesaj çox uzundur" };

  try {
    await sendMessage(conversationId, body);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Mesaj göndərilmədi" };
  }

  revalidatePath(`/dashboard/messages/${conversationId}`);
  return {};
}
