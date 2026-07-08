import Link from "next/link";
import { Eye, Inbox, Briefcase } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getAnalytics } from "@/lib/employer/service";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { jobStatusLabels, jobStatusTone } from "@/lib/constants";

export const metadata = { title: "Statistika" };

export default async function EmployerAnalyticsPage() {
  await requireRole(["employer"]);
  const { totals, jobs } = await getAnalytics();

  const maxViews = Math.max(1, ...jobs.map((j) => j.views));

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Statistika</h1>
      <p className="mb-6 text-muted">Vakansiyalarının performansı — baxış və müraciət sayı.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={Briefcase} label="Aktiv vakansiya" value={totals.activeJobs} />
        <Stat icon={Eye} label="Ümumi baxış" value={totals.totalViews} />
        <Stat icon={Inbox} label="Ümumi müraciət" value={totals.totalApplications} />
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="Hələ vakansiya yoxdur" />
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/jobs/${j.slug}`} className="font-display font-semibold text-ink hover:text-primary">
                  {j.title}
                </Link>
                <Badge tone={jobStatusTone[j.status]}>{jobStatusLabels[j.status]}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-6 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Eye className="h-4 w-4" /> {j.views} baxış
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Inbox className="h-4 w-4" /> {j.applications} müraciət
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round((j.views / maxViews) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-tint text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
