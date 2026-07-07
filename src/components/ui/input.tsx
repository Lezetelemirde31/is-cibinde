import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-ink placeholder:text-muted",
        "transition-colors focus:border-primary focus:outline-none",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
