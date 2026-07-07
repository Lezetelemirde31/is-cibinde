"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Action = { label: string; variant?: "primary" | "secondary" | "danger"; run: () => Promise<unknown> };

export function ModerationButtons({ actions }: { actions: Action[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <Button
          key={a.label}
          size="sm"
          variant={a.variant ?? "secondary"}
          disabled={pending}
          onClick={() => start(async () => { await a.run(); router.refresh(); })}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}
