"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability; replace with your error reporter in production.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-5xl font-bold text-primary">Xəta</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Nəsə səhv getdi</h1>
      <p className="mt-2 max-w-md text-muted">
        Gözlənilməz xəta baş verdi. Yenidən cəhd et və ya bir az sonra qayıt.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted">Kod: {error.digest}</p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCw className="h-4 w-4" /> Yenidən cəhd et
        </Button>
        <ButtonLink href="/" variant="secondary">
          Ana səhifə
        </ButtonLink>
      </div>
    </div>
  );
}
