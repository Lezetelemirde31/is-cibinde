import "server-only";
import { apiFetch } from "@/lib/api-client";

export type UploadKind = "cv" | "logo" | "avatar" | "document";

export async function presignUpload(args: {
  kind: UploadKind;
  contentType: string;
  size: number;
  ext: string;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  return apiFetch("/uploads/presign", { method: "POST", body: args });
}
