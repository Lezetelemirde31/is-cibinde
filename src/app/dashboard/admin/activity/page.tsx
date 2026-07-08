import Link from "next/link";
import { UserPlus, Briefcase, FileText, Building2, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getAdminActivity, type ActivityEvent } from "@/lib/admin/service";
import { EmptyState } from "@/components/ui/empty-state";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Fəaliyyət" };

const meta: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; label: string; tone: string }
> = {
  user_registered: { icon: UserPlus, label: "Yeni istifadəçi", tone: "bg-primary-tint text-primary" },
  job_posted: { icon: Briefcase, label: "Yeni vakansiya", tone: "bg-success/10 text-success" },
  application: { icon: FileText, label: "Yeni müraciət", tone: "bg-warning/10 text-warning" },
  company_registered: { icon: Building2, label: "Yeni şirkət", tone: "bg-primary-tint text-primary" },
  moderation: { icon: ShieldCheck, label: "Moderasiya", tone: "bg-panel text-muted" }
};

function Item({ e }: { e: ActivityEvent }) {
  const m = meta[e.type] ?? meta.moderation;
  const body = (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-card transition-colors hover:border-primary/40">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${m.tone}`}>
        <m.icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">{m.label}</p>
        <p className="truncate font-medium text-ink">{e.title}</p>
        {e.meta && <p className="truncate text-sm text-muted">{e.meta}</p>}
      </div>
      <span className="shrink-0 text-xs text-muted">{timeAgo(e.at)}</span>
    </div>
  );
  return e.href ? (
    <Link href={e.href}>{body}</Link>
  ) : (
    <div>{body}</div>
  );
}

export default async function AdminActivityPage() {
  await requireRole(["admin", "moderator"]);
  const events = await getAdminActivity();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Fəaliyyət</h1>
      <p className="mb-6 text-muted">Platformada baş verən son hadisələr — kim nə etdi.</p>

      {events.length === 0 ? (
        <EmptyState title="Hələ fəaliyyət yoxdur" />
      ) : (
        <div className="space-y-2.5">
          {events.map((e, i) => (
            <Item key={`${e.type}-${i}`} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}
