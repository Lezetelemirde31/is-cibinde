import { requireRole } from "@/lib/auth";
import { mySavedJobs } from "@/lib/candidate/service";
import { JobCard } from "@/components/jobs/job-card";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Yadda saxlananlar" };

export default async function SavedJobsPage() {
  await requireRole(["job_seeker"]);
  const jobs = await mySavedJobs();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Yadda saxlananlar</h1>
      {jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">Hələ vakansiya yadda saxlamamısan.</p>
          <ButtonLink href="/jobs" className="mt-4">Vakansiyalara bax</ButtonLink>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
