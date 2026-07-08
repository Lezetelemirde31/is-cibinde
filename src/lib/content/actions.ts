"use server";

import { sendContact } from "./service";
import { contactSchema } from "@/lib/validation";
import { ApiError } from "@/lib/api-client";

/** Used by the support widget to send a message without leaving the page. */
export async function submitContactAction(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Yanlış məlumat" };
  }
  try {
    await sendContact(parsed.data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof ApiError ? err.message : "Göndərilmədi" };
  }
}
