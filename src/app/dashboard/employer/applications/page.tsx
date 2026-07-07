import { requireRole } from "@/lib/auth";
import { myApplications } from "@/lib/employer/service";
import { timeAgo } from "@/lib/utils";
import { ApplicationStatusControl } from "./status-control";
import { startConversationAction } from "@/app/dashboard/messages/actions";

export const metadata = { title: "Müraciətlər" };

export default async function EmployerApplicationsPage() {
  await requireRole(["employer"]);
  const apps = await myApplications();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Müraciətlər</h1>

      {apps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">Hələ müraciət yoxdur. Vakansiyaların görünən kimi buraya düşəcək.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-ink">
                    {a.candidateName ?? a.candidateEmail}
                  </p>
                  <p className="text-sm text-muted">
                    {a.candidateHeadline ?? "—"}
                    {a.candidateCity ? ` · ${a.candidateCity}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {a.jobTitle} · {timeAgo(a.createdAt)}
                  </p>
                </div>
                <ApplicationStatusControl applicationId={a.id} current={a.status} />
              </div>
              {a.coverLetter && (
                <p className="mt-3 rounded-md bg-panel p-3 text-sm text-ink/90">{a.coverLetter}</p>
              )}
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={`mailto:${a.candidateEmail}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  E-poçt yaz
                </a>
                <form action={startConversationAction.bind(null, a.candidateId, a.jobId)}>
                  <button type="submit" className="text-sm font-medium text-primary hover:underline">
                    Mesaj göndər
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
