"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Briefcase, Mail, HelpCircle } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { buildNavItems } from "./nav-items";

export type MobileNavLabels = {
  jobs: string;
  companies: string;
  blog: string;
  about: string;
  signIn: string;
  signUp: string;
  dashboard: string;
  contact: string;
  faq: string;
};

/** Hamburger button (md:hidden) that opens a left slide-in drawer, portaled to
 * <body> so it escapes the navbar's stacking context. */
export function MobileMenu({ labels }: { labels: MobileNavLabels }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const items = buildNavItems(labels);

  const secondary = [
    { href: "/contact", label: labels.contact, icon: Mail },
    { href: "/faq", label: labels.faq, icon: HelpCircle }
  ];

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

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

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <div
              className="absolute inset-0 animate-fade-in bg-ink/50"
              onClick={close}
              aria-hidden
            />

            <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] animate-slide-in-left flex-col border-r border-border bg-surface shadow-lift">
              {/* Header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <Link href="/" onClick={close} className="flex items-center gap-2" aria-label="İş Cibində">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <span className="font-display text-lg font-bold tracking-tight text-ink">
                    İş Cibində
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Bağla"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col overflow-y-auto">
                <nav aria-label={labels.jobs} className="flex flex-col gap-1 p-3">
                  {items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
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

                  <div className="my-2 border-t border-border" />

                  {secondary.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-panel hover:text-ink"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Bottom auth CTA */}
                <div className="mt-auto space-y-2 border-t border-border p-4">
                  <SignedOut>
                    <ButtonLink href="/sign-up" onClick={close} className="w-full">
                      {labels.signUp}
                    </ButtonLink>
                    <ButtonLink href="/sign-in" onClick={close} variant="secondary" className="w-full">
                      {labels.signIn}
                    </ButtonLink>
                  </SignedOut>
                  <SignedIn>
                    <ButtonLink href="/dashboard" onClick={close} className="w-full">
                      {labels.dashboard}
                    </ButtonLink>
                  </SignedIn>
                  <p className="pt-1 text-center font-display text-sm font-medium text-muted">
                    İş cibində.
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
