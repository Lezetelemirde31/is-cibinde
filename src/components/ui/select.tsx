import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink",
      "transition-colors focus:border-primary focus:outline-none",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
