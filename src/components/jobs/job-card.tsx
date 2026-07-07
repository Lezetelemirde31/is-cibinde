import Link from "next/link";
import { MapPin, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatSalary, timeAgo } from "@/lib/utils";
import { employmentTypeLabels } from "@/lib/constants";
import type { JobListItem } from "@/lib/jobs/service";

export function JobCard({ job }: { job: JobListItem }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryHidden);

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block rounded-lg border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-panel">
          {job.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-lg font-semibold text-primary">
              {job.companyName.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate font-display text-base font-semibold text-ink group-hover:text-primary">
              {job.title}
            </h3>
            {job.isFeatured && <Badge tone="primary">Seçilmiş</Badge>}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">{job.companyName}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
            <Badge>{employmentTypeLabels[job.employmentType] ?? job.employmentType}</Badge>
            {job.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.city}
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Wifi className="h-3.5 w-3.5" /> Uzaqdan
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            {salary ? (
              <span className="text-sm font-medium text-ink">{salary}</span>
            ) : (
              <span className="text-sm text-muted">Razılaşma ilə</span>
            )}
            {job.publishedAt && (
              <span className="text-xs text-muted">{timeAgo(job.publishedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
