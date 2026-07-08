"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X, ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export type SupportLabels = {
  label: string;
  title: string;
  greeting: string;
  q1: string;
  a1: string;
  q2: string;
  a2: string;
  q3: string;
  a3: string;
  contactCta: string;
  contactButton: string;
};

/** Floating help/support widget (bottom-right) with quick FAQ answers. */
export function SupportWidget({ labels }: { labels: SupportLabels }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const qa = [
    { q: labels.q1, a: labels.a1 },
    { q: labels.q2, a: labels.a2 },
    { q: labels.q3, a: labels.a3 }
  ];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] animate-fade-up flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-fg">
            <span className="font-display text-sm font-semibold">{labels.title}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Bağla" className="rounded-md p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            <p className="text-sm text-ink">{labels.greeting}</p>

            <div className="mt-4 space-y-2">
              {qa.map((item, i) => {
                const isOpen = expanded === i;
                return (
                  <div key={i} className="overflow-hidden rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-panel"
                    >
                      {item.q}
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && <p className="border-t border-border bg-panel px-3 py-2.5 text-sm text-muted">{item.a}</p>}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg bg-primary-tint p-3 text-center">
              <p className="text-sm text-ink">{labels.contactCta}</p>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-all hover:brightness-110"
              >
                <Send className="h-3.5 w-3.5" /> {labels.contactButton}
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={labels.label}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lift transition-all hover:brightness-110 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
