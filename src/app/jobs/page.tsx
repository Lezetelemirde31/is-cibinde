import type { Metadata } from "next";
import { Search } from "lucide-react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { listJobs } from "@/lib/jobs/service";

export const metadata: Metadata = {
  title: "Vakansiyalar",
  description: "Azərbaycanda aktiv iş elanlarını axtar və filtrlə.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Vakansiyalar · İş Cibində",
    description: "Azərbaycanda aktiv iş elanlarını axtar və filtrlə.",
    type: "website"
  }
};

type SP = Record<string, string | undefined>;

export default async function JobsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1) || 1;

  const { items, total, pageSize } = await listJobs({
    q: sp.q,
    city: sp.city,
    employmentType: sp.employmentType,
    experienceLevel: sp.experienceLevel,
    remote: sp.remote === "1",
    page
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function pageHref(p: number) {
    const next = new URLSearchParams(sp as Record<string, string>);
    next.set("page", String(p));
    return `/jobs?${next.toString()}`;
  }

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink">Vakansiyalar</h1>
        <p className="mt-1 text-muted" aria-live="polite">
          {total} aktiv vakansiya tapıldı
        </p>
      </div>

      <JobFilters />

      <div className="mt-6">
        {items.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Vakansiya tapılmadı"
            description="Bu meyarlara uyğun vakansiya tapılmadı. Filtri dəyişib yenidən yoxlayın."
          />
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} buildHref={pageHref} className="mt-8" />
    </div>
  );
}
