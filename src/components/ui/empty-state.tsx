import * as React from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Use "dashed" for in-flow lists, "plain" when nested inside a card. */
  variant?: "dashed" | "plain";
};

/**
 * Consistent empty-state block used across listings and dashboards.
 * Replaces the copy-pasted "rounded border-dashed … text-center" blocks.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "dashed"
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        variant === "dashed" && "rounded-lg border border-dashed border-border",
        className
      )}
    >
      {Icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-panel text-muted">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="font-display font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
