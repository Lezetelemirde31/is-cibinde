import { cn } from "@/lib/utils";

/**
 * Animated placeholder block. Uses a subtle pulse and respects
 * prefers-reduced-motion (the animation is disabled globally in that case).
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-panel", className)}
      {...props}
    />
  );
}

/** A card-shaped skeleton matching JobCard / company card dimensions. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5 shadow-card", className)}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
