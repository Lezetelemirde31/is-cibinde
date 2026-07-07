"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/jobs", label: "Vakansiyalar" },
  { href: "/companies", label: "Şirkətlər" },
  { href: "/blog", label: "Bloq" },
  { href: "/about", label: "Haqqımızda" }
];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-6 text-sm font-medium", className)} aria-label="Əsas naviqasiya">
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
