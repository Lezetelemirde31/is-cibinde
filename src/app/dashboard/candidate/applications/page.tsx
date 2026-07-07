import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { myApplications } from "@/lib/candidate/service";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { applicationStatusLabels, applicationStatusTone } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Müraciətlərim" };

export default async function CandidateApplicationsPage() {
  await requireRole(["job_seeker"]);
  const apps = await myApplications();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Müraciətlərim</h1>

      {apps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">Hələ heç bir vakansiyaya müraciət etməmisən.</p>
          <ButtonLink href="/jobs" className="mt-4">Vakansiyalara bax</ButtonLink>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-panel text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Vəzifə</th>
                <th className="px-4 py-3 font-medium">Şirkət</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tarix</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/jobs/${a.jobSlug}`} className="font-medium text-ink hover:text-primary">
                      {a.jobTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{a.companyName}</td>
                  <td className="px-4 py-3">
                    <Badge tone={applicationStatusTone[a.status]}>
                      {applicationStatusLabels[a.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">{timeAgo(a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
