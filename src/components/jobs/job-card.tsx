import Link from "next/link";
import { MapPin, Wifi, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatSalary, timeAgo } from "@/lib/utils";
import { employmentTypeLabels, experienceLevelLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { JobListItem } from "@/lib/jobs/service";

const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export function JobCard({ job }: { job: JobListItem }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryHidden);
  const isNew =
    job.publishedAt != null && Date.now() - new Date(job.publishedAt).getTime() < NEW_WINDOW_MS;

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={cn(
        "group block rounded-xl border bg-surface p-5 shadow-card transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lift",
        job.isFeatured ? "border-primary/30 ring-1 ring-primary/20" : "border-border"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-panel">
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-base font-semibold text-ink group-hover:text-primary">
              {job.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {isNew && (
                <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  Yeni
                </span>
              )}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <Sparkles className="h-3 w-3" /> Seçilmiş
                </span>
              )}
            </div>
          </div>

          <p className="mt-0.5 truncate text-sm text-muted">{job.companyName}</p>

          {/* Meta chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <Badge tone="primary">{employmentTypeLabels[job.employmentType] ?? job.employmentType}</Badge>
            {job.experienceLevel && <Badge>{experienceLevelLabels[job.experienceLevel]}</Badge>}
            {job.city && (
              <span className="inline-flex items-center gap-1 text-muted">
                <MapPin className="h-3.5 w-3.5" /> {job.city}
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2 py-0.5 text-primary">
                <Wifi className="h-3.5 w-3.5" /> Uzaqdan
              </span>
            )}
          </div>

          {/* Footer: salary + posted time */}
          <div className="mt-3 flex items-center justify-between gap-2">
            {salary ? (
              <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-sm font-semibold text-success">
                {salary}
              </span>
            ) : (
              <span className="text-sm text-muted">Razılaşma ilə</span>
            )}
            {job.publishedAt && (
              <span className="shrink-0 text-xs text-muted">{timeAgo(job.publishedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
