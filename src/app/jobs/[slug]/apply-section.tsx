"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { applyAction, type ApplyState } from "../actions";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type ApplyLabels = {
  signInPrompt: string;
  signIn: string;
  signUp: string;
  employerCannotApply: string;
  applied: string;
  applyButton: string;
  coverLetterLabel: string;
  coverLetterPlaceholder: string;
  submitting: string;
  submit: string;
  cancel: string;
};

type Props = {
  jobId: string;
  isAuthenticated: boolean;
  canApply: boolean; // job_seeker role
  alreadyApplied: boolean;
  labels: ApplyLabels;
};

export function ApplySection({ jobId, isAuthenticated, canApply, alreadyApplied, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ApplyState, FormData>(applyAction, {});

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-border bg-panel p-5">
        <p className="text-sm text-muted">{labels.signInPrompt}</p>
        <div className="mt-3 flex gap-2">
          <ButtonLink href={`/sign-in?redirect_url=/jobs`} size="sm">{labels.signIn}</ButtonLink>
          <ButtonLink href="/sign-up" variant="secondary" size="sm">{labels.signUp}</ButtonLink>
        </div>
      </div>
    );
  }

  if (!canApply) {
    return (
      <div className="rounded-lg border border-border bg-panel p-5 text-sm text-muted">
        {labels.employerCannotApply}
      </div>
    );
  }

  if (alreadyApplied || state.ok) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-5 text-sm font-medium text-success">
        <CheckCircle2 className="h-5 w-5" />
        {labels.applied}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      {!open ? (
        <Button className="w-full" onClick={() => setOpen(true)}>{labels.applyButton}</Button>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="jobId" value={jobId} />
          <label className="block text-sm font-medium text-ink">{labels.coverLetterLabel}</label>
          <Textarea name="coverLetter" placeholder={labels.coverLetterPlaceholder} maxLength={4000} />
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? labels.submitting : labels.submit}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              {labels.cancel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
