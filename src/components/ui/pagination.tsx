import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Builds a compact page range with ellipsis, e.g. [1, "…", 4, 5, 6, "…", 20]. */
function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

const cellBase =
  "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors";

export function Pagination({
  page,
  totalPages,
  buildHref,
  className
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Səhifələmə"
    >
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          rel="prev"
          aria-label="Əvvəlki səhifə"
          className={cn(cellBase, "border border-border text-muted hover:text-ink")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(cellBase, "border border-border text-border")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pageRange(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-label={`Səhifə ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              cellBase,
              p === page
                ? "bg-primary text-primary-fg"
                : "border border-border text-muted hover:text-ink"
            )}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          rel="next"
          aria-label="Növbəti səhifə"
          className={cn(cellBase, "border border-border text-muted hover:text-ink")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(cellBase, "border border-border text-border")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
