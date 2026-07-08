"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLabels = {
  jobs: string;
  companies: string;
  blog: string;
  about: string;
};

export function NavLinks({ className, labels }: { className?: string; labels: NavLabels }) {
  const pathname = usePathname();

  const links = [
    { href: "/jobs", label: labels.jobs },
    { href: "/companies", label: labels.companies },
    { href: "/blog", label: labels.blog },
    { href: "/about", label: labels.about }
  ];

  return (
    <nav className={cn("items-center gap-6 text-sm font-medium", className)} aria-label={labels.jobs}>
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "transition-colors",
              active ? "text-primary" : "text-muted hover:text-ink"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
