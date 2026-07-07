import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { listCompaniesForModeration } from "@/lib/admin/service";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { companyStatusLabels, companyStatusTone } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { setCompanyStatusAction } from "../actions";
import { ModerationButtons } from "../moderation-buttons";

export const metadata = { title: "Şirkət təsdiqi" };

export default async function AdminCompaniesPage() {
  await requireRole(["admin", "moderator"]);
  const rows = await listCompaniesForModeration();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Şirkət təsdiqi</h1>
      {rows.length === 0 ? (
        <EmptyState title="Şirkət yoxdur" description="Təsdiq üçün gözləyən şirkət yoxdur." />
      ) : (
        <div className="space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
              <div>
                <Link href={`/companies/${c.slug}`} className="font-display font-semibold text-ink hover:text-primary">{c.name}</Link>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <Badge tone={companyStatusTone[c.status]}>{companyStatusLabels[c.status]}</Badge>
                  {c.industry && <span>{c.industry}</span>}
                  <span>· {timeAgo(c.createdAt)}</span>
                </div>
              </div>
              <ModerationButtons
                actions={[
                  ...(c.status !== "verified"
                    ? [{ label: "Təsdiqlə", variant: "primary" as const, run: setCompanyStatusAction.bind(null, c.id, "verified") }]
                    : []),
                  ...(c.status !== "rejected"
                    ? [{ label: "Rədd et", variant: "danger" as const, run: setCompanyStatusAction.bind(null, c.id, "rejected") }]
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
