"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { applyAction, type ApplyState } from "../actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  jobId: string;
  isAuthenticated: boolean;
  canApply: boolean; // job_seeker role
  alreadyApplied: boolean;
};

export function ApplySection({ jobId, isAuthenticated, canApply, alreadyApplied }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ApplyState, FormData>(applyAction, {});

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-border bg-panel p-5">
        <p className="text-sm text-muted">Müraciət etmək üçün daxil ol və ya hesab yarat.</p>
        <div className="mt-3 flex gap-2">
          <ButtonLink href={`/sign-in?redirect_url=/jobs`} size="sm">Daxil ol</ButtonLink>
          <ButtonLink href="/sign-up" variant="secondary" size="sm">Qeydiyyat</ButtonLink>
        </div>
      </div>
    );
  }

  if (!canApply) {
    return (
      <div className="rounded-lg border border-border bg-panel p-5 text-sm text-muted">
        İşəgötürən hesabı ilə vakansiyalara müraciət edilə bilməz.
      </div>
    );
  }

  if (alreadyApplied || state.ok) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-5 text-sm font-medium text-success">
        <CheckCircle2 className="h-5 w-5" />
        Müraciətin göndərildi. Statusu paneldən izləyə bilərsən.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      {!open ? (
        <Button className="w-full" onClick={() => setOpen(true)}>Müraciət et</Button>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="jobId" value={jobId} />
          <label className="block text-sm font-medium text-ink">
            Qısa müraciət məktubu (istəyə bağlı)
          </label>
          <Textarea
            name="coverLetter"
            placeholder="Niyə bu vəzifə üçün uyğun olduğunu qısaca yaz…"
            maxLength={4000}
          />
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Göndərilir…" : "Müraciəti göndər"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Ləğv et
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
