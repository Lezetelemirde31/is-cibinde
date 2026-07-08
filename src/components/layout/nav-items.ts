import { Briefcase, Building2, BookOpen, Info, type LucideIcon } from "lucide-react";

export type NavLabels = {
  jobs: string;
  companies: string;
  blog: string;
  about: string;
};

export type NavItem = { href: string; label: string; icon: LucideIcon };

/** Shared primary-nav definition (icons + hrefs) used by desktop and mobile. */
export function buildNavItems(labels: NavLabels): NavItem[] {
  return [
    { href: "/jobs", label: labels.jobs, icon: Briefcase },
    { href: "/companies", label: labels.companies, icon: Building2 },
    { href: "/blog", label: labels.blog, icon: BookOpen },
    { href: "/about", label: labels.about, icon: Info }
  ];
}
