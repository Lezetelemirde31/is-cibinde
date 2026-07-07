import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted",
      "transition-colors focus:border-primary focus:outline-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
