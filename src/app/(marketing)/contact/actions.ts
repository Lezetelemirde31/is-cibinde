"use server";

import { sendContact } from "@/lib/content/service";
import { contactSchema } from "@/lib/validation";
import { ApiError } from "@/lib/api-client";

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function sendContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { fieldErrors };
  }

  try {
    await sendContact(parsed.data);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Xəta baş verdi" };
  }
  return { ok: true };
}
