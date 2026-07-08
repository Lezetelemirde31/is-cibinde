"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { NavLabels } from "./nav-links";
import { cn } from "@/lib/utils";

/** Hamburger menu shown only on small screens (md:hidden). */
export function MobileMenu({ labels }: { labels: NavLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: labels.jobs },
    { href: "/companies", label: labels.companies },
    { href: "/blog", label: labels.blog },
    { href: "/about", label: labels.about }
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-panel"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 top-16 z-40 cursor-default bg-ink/20"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label={labels.jobs}
            className="fixed inset-x-0 top-16 z-50 border-b border-border bg-surface shadow-card"
          >
            <ul className="container-page flex flex-col py-2">
              {links.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        active ? "bg-primary-tint text-primary" : "text-ink hover:bg-panel"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
