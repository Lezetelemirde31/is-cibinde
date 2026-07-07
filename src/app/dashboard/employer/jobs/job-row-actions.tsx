"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeJobStatusAction } from "../actions";
import { Button } from "@/components/ui/button";

export function JobRowActions({ jobId, isClosed }: { jobId: string; isClosed: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [closed, setClosed] = useState(isClosed);

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await changeJobStatusAction(jobId, !closed);
          setClosed(!closed);
          router.refresh();
        })
      }
    >
      {closed ? "Yenidən aç" : "Bağla"}
    </Button>
  );
}
