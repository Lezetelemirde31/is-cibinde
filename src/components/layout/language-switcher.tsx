"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  LOCALE_COOKIE,
  localeNames,
  localeShort,
  locales,
  type Locale
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function choose(locale: Locale) {
    // Year-long cookie; the server reads it via getLocale().
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    start(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted transition-colors hover:bg-panel hover:text-ink disabled:opacity-60"
      >
        <Globe className="h-4 w-4" />
        <span>{localeShort[current]}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-lift"
          >
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                role="menuitemradio"
                aria-checked={locale === current}
                onClick={() => choose(locale)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-panel",
                  locale === current ? "font-medium text-ink" : "text-muted"
                )}
              >
                {localeNames[locale]}
                {locale === current && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
