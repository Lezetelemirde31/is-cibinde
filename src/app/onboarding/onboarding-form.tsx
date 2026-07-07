"use client";

import { useActionState, useState } from "react";
import { completeOnboardingAction, type OnboardingState } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function OnboardingForm() {
  const [role, setRole] = useState<"job_seeker" | "employer">("job_seeker");
  const [state, action, pending] = useActionState<OnboardingState, FormData>(
    completeOnboardingAction,
    {}
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="role" value={role} />

      <div>
        <Label>Sən kimsən?</Label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["job_seeker", "İş axtarıram", "Vakansiyalara müraciət et"],
              ["employer", "İşəgötürənəm", "Vakansiya yerləşdir"]
            ] as const
          ).map(([value, title, sub]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`rounded-lg border p-4 text-left transition-all ${
                role === value
                  ? "border-primary bg-primary-tint"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="block font-display text-sm font-semibold text-ink">{title}</span>
              <span className="mt-0.5 block text-xs text-muted">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Ad, soyad</Label>
        <Input id="fullName" name="fullName" autoComplete="name" required />
        {state.fieldErrors?.fullName && (
          <p className="mt-1 text-xs text-danger">{state.fieldErrors.fullName}</p>
        )}
      </div>

      {role === "employer" && (
        <div>
          <Label htmlFor="companyName">Şirkət adı</Label>
          <Input id="companyName" name="companyName" required />
          {state.fieldErrors?.companyName && (
            <p className="mt-1 text-xs text-danger">{state.fieldErrors.companyName}</p>
          )}
        </div>
      )}

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Hazırlanır…" : "Davam et"}
      </Button>
    </form>
  );
}
