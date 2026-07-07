"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatusAction } from "../actions";
import { Select } from "@/components/ui/select";
import { applicationStatusLabels } from "@/lib/constants";

const SELECTABLE = [
  "submitted",
  "viewed",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected"
] as const;

export function ApplicationStatusControl({
  applicationId,
  current
}: {
  applicationId: string;
  current: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [value, setValue] = useState(current);

  return (
    <Select
      value={value}
      disabled={pending}
      className="w-44"
      onChange={(e) => {
        const next = e.target.value as (typeof SELECTABLE)[number];
        setValue(next);
        start(async () => {
          await updateApplicationStatusAction(applicationId, next);
          router.refresh();
        });
      }}
    >
      {SELECTABLE.map((s) => (
        <option key={s} value={s}>{applicationStatusLabels[s]}</option>
      ))}
    </Select>
  );
}
