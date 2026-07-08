import Link from "next/link";
import { Briefcase } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { myJobs } from "@/lib/employer/service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { employmentTypeLabels, jobStatusLabels, jobStatusTone } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { JobRowActions } from "./job-row-actions";

export const metadata = { title: "Vakansiyalarım" };

export default async function EmployerJobsPage() {
  await requireRole(["employer"]);
  const jobs = await myJobs();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Vakansiyalarım</h1>
        <ButtonLink href="/dashboard/employer/post" size="sm">Yeni vakansiya</ButtonLink>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Hələ vakansiya yerləşdirməmisən"
          description="İlk elanını dərc et və namizədlərdən müraciət qəbul etməyə başla."
          action={<ButtonLink href="/dashboard/employer/post">İlk vakansiyanı yerləşdir</ButtonLink>}
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <div>
                <Link href={`/jobs/${job.slug}`} className="font-display font-semibold text-ink hover:text-primary">
                  {job.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <Badge tone={jobStatusTone[job.status]}>{jobStatusLabels[job.status]}</Badge>
                  <span>{employmentTypeLabels[job.employmentType]}</span>
                  <span>· {job.applicationCount} müraciət</span>
                  <span>· {timeAgo(job.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ButtonLink href={`/dashboard/employer/jobs/${job.id}/edit`} variant="secondary" size="sm">
                  Düzəliş
                </ButtonLink>
                <JobRowActions jobId={job.id} isClosed={job.status === "closed"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
