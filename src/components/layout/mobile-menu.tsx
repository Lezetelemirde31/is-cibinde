"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildNavItems, type NavLabels } from "./nav-items";

/** Hamburger button (md:hidden) that opens a left slide-in drawer. */
export function MobileMenu({ labels }: { labels: NavLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = buildNavItems(labels);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-panel"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 animate-fade-in cursor-default bg-ink/40"
            onClick={() => setOpen(false)}
          />

          {/* Left drawer */}
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] animate-slide-in-left flex-col border-r border-border bg-surface shadow-lift">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
                aria-label="İş Cibində"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
                  <Briefcase className="h-4 w-4" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-ink">
                  İş Cibində
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Bağla"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label={labels.jobs} className="flex flex-col gap-1 p-3">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      active ? "bg-primary-tint text-primary" : "text-ink hover:bg-panel"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
