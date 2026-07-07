"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed border-border p-10 text-center">
      <h2 className="font-display text-xl font-bold text-ink">Məlumat yüklənmədi</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Panel məlumatlarını gətirərkən xəta baş verdi. Bir az sonra yenidən cəhd et.
      </p>
      <Button onClick={reset} className="mt-5">
        <RotateCw className="h-4 w-4" /> Yenidən cəhd et
      </Button>
    </div>
  );
}
