"use server";

import { requireUser } from "@/lib/auth";
import { presignUpload, type UploadKind } from "./service";

export type UploadUrlState =
  | { ok: true; uploadUrl: string; publicUrl: string }
  | { ok: false; error: string };

export async function getUploadUrlAction(
  kind: UploadKind,
  contentType: string,
  size: number,
  ext: string
): Promise<UploadUrlState> {
  await requireUser();
  try {
    const { uploadUrl, publicUrl } = await presignUpload({ kind, contentType, size, ext });
    return { ok: true, uploadUrl, publicUrl };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Yükləmə alınmadı" };
  }
}
