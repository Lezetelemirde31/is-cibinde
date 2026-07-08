import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getJobForEdit } from "@/lib/jobs/service";
import { PostJobForm } from "../../../post/post-job-form";

export const metadata = { title: "Vakansiyanı redaktə et" };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole(["employer"]);
  const job = await getJobForEdit(id);
  if (!job) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Vakansiyanı redaktə et</h1>
      <p className="mt-1 mb-6 text-muted">Vakansiya məlumatlarını yeniləyin.</p>
      <PostJobForm
        jobId={id}
        initial={{
          title: job.title,
          description: job.description,
          responsibilities: job.responsibilities ?? "",
          requirements: job.requirements ?? "",
          employmentType: job.employmentType as
            | "full_time"
            | "part_time"
            | "contract"
            | "internship"
            | "temporary"
            | "remote",
          experienceLevel: job.experienceLevel ?? "",
          city: job.city ?? "",
          isRemote: job.isRemote,
          salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
          salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
          salaryHidden: job.salaryHidden,
          skills: job.skills.join(", ")
        }}
      />
    </div>
  );
}
