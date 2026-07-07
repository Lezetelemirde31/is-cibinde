"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { saveCvUrlAction } from "../actions";
import { getUploadUrlAction } from "@/lib/uploads/actions";
import { Button } from "@/components/ui/button";

export function CvUpload({ currentUrl }: { currentUrl: string | null }) {
  const [url, setUrl] = useState(currentUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "pdf";
      const presign = await getUploadUrlAction("cv", file.type, file.size, ext);
      if (!presign.ok) throw new Error(presign.error);

      const put = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });
      if (!put.ok) throw new Error("Fayl serverə yüklənmədi");

      const res = await saveCvUrlAction(presign.publicUrl);
      if (res.error) throw new Error(res.error);
      setUrl(presign.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-semibold text-ink">CV</p>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" /> Yüklənib — bax
              </a>
            ) : (
              <p className="text-sm text-muted">PDF, maksimum 8 MB</p>
            )}
          </div>
        </div>
        <label className="cursor-pointer">
          <input type="file" accept="application/pdf" className="hidden" onChange={onFile} disabled={busy} />
          <span className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-panel px-3 text-sm font-medium text-ink transition-colors hover:bg-primary-tint">
            <Upload className="h-4 w-4" /> {busy ? "Yüklənir…" : url ? "Dəyiş" : "Yüklə"}
          </span>
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
