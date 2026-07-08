"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildNavItems, type NavLabels } from "./nav-items";

export type { NavLabels };

export function NavLinks({ className, labels }: { className?: string; labels: NavLabels }) {
  const pathname = usePathname();
  const items = buildNavItems(labels);

  return (
    <nav className={cn("items-center gap-1", className)} aria-label={labels.jobs}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-primary-tint text-primary" : "text-muted hover:bg-panel hover:text-ink"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
