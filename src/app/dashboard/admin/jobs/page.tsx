import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { listJobsForModeration } from "@/lib/admin/service";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { jobStatusLabels, jobStatusTone } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { moderateJobAction } from "../actions";
import { ModerationButtons } from "../moderation-buttons";

export const metadata = { title: "Vakansiya moderasiyası" };

export default async function AdminJobsPage() {
  await requireRole(["admin", "moderator"]);
  const rows = await listJobsForModeration();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Vakansiya moderasiyası</h1>
      {rows.length === 0 ? (
        <EmptyState title="Vakansiya yoxdur" description="Moderasiya üçün gözləyən vakansiya yoxdur." />
      ) : (
        <div className="space-y-3">
          {rows.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
              <div>
                <Link href={`/jobs/${j.slug}`} className="font-display font-semibold text-ink hover:text-primary">{j.title}</Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <Badge tone={jobStatusTone[j.status]}>{jobStatusLabels[j.status]}</Badge>
                  <span>{j.companyName}</span>
                  <span>· {timeAgo(j.createdAt)}</span>
                </div>
              </div>
              <ModerationButtons
                actions={[
                  ...(j.status !== "active"
                    ? [{ label: "Təsdiqlə", variant: "primary" as const, run: moderateJobAction.bind(null, j.id, "active") }]
                    : []),
                  ...(j.status !== "rejected"
                    ? [{ label: "Rədd et", variant: "danger" as const, run: moderateJobAction.bind(null, j.id, "rejected") }]
                    : []),
                  ...(j.status === "active"
                    ? [{ label: "Bağla", run: moderateJobAction.bind(null, j.id, "closed") }]
                    : [])
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
