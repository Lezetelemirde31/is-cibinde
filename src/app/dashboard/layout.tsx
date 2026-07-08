import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  User,
  Briefcase,
  PlusCircle,
  Users,
  Inbox,
  ShieldCheck,
  Building2,
  MessageSquare,
  Activity
} from "lucide-react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { unreadCount } from "@/lib/notifications/service";
import type { Role } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const navByRole: Record<string, NavItem[]> = {
  job_seeker: [
    { href: "/dashboard", label: "İcmal", icon: LayoutDashboard },
    { href: "/dashboard/candidate/applications", label: "Müraciətlərim", icon: FileText },
    { href: "/dashboard/candidate/saved", label: "Yadda saxlananlar", icon: Bookmark },
    { href: "/dashboard/candidate/profile", label: "Profil və CV", icon: User },
    { href: "/dashboard/messages", label: "Mesajlar", icon: MessageSquare }
  ],
  employer: [
    { href: "/dashboard", label: "İcmal", icon: LayoutDashboard },
    { href: "/dashboard/employer/post", label: "Vakansiya yerləşdir", icon: PlusCircle },
    { href: "/dashboard/employer/jobs", label: "Vakansiyalarım", icon: Briefcase },
    { href: "/dashboard/employer/applications", label: "Müraciətlər", icon: Inbox },
    { href: "/dashboard/employer/candidates", label: "Namizədlər", icon: Users },
    { href: "/dashboard/messages", label: "Mesajlar", icon: MessageSquare }
  ],
  moderator: [
    { href: "/dashboard", label: "İcmal", icon: LayoutDashboard },
    { href: "/dashboard/admin/activity", label: "Fəaliyyət", icon: Activity },
    { href: "/dashboard/admin/jobs", label: "Vakansiya moderasiyası", icon: Briefcase },
    { href: "/dashboard/admin/companies", label: "Şirkət təsdiqi", icon: Building2 }
  ],
  admin: [
    { href: "/dashboard", label: "İcmal", icon: LayoutDashboard },
    { href: "/dashboard/admin/activity", label: "Fəaliyyət", icon: Activity },
    { href: "/dashboard/admin/users", label: "İstifadəçilər", icon: Users },
    { href: "/dashboard/admin/jobs", label: "Vakansiya moderasiyası", icon: Briefcase },
    { href: "/dashboard/admin/companies", label: "Şirkət təsdiqi", icon: Building2 }
  ]
};

const roleLabels: Record<Role, string> = {
  job_seeker: "İş axtaran",
  employer: "İşəgötürən",
  moderator: "Moderator",
  admin: "Administrator"
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  if (!user.onboardingCompletedAt) redirect("/onboarding");
  const items = navByRole[user.role] ?? navByRole.job_seeker;
  const unread = await unreadCount();

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-4 rounded-lg border border-border bg-panel p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {roleLabels[user.role]}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-ink">{user.email}</p>
          {unread > 0 && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-2 py-0.5 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> {unread} yeni bildiriş
            </p>
          )}
        </div>
        <nav className="space-y-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-panel hover:text-ink"
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
