import { FileText, Bookmark, Briefcase, Inbox, PlusCircle, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard/service";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Panel" };

export default async function DashboardHome() {
  await requireUser();
  const stats = await getDashboardStats();

  if (stats.role === "admin" || stats.role === "moderator") {
    const s = stats.data;
    return (
      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-ink">Moderasiya paneli</h1>
        <p className="mt-1 text-muted">Vakansiya və şirkətləri yoxla, istifadəçiləri idarə et.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Briefcase} label="Gözləyən vakansiya" value={s.pendingJobs} />
          <StatCard icon={Users} label="Gözləyən şirkət" value={s.pendingCompanies} />
          <StatCard icon={Inbox} label="İstifadəçilər" value={s.totalUsers} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/dashboard/admin/jobs">Vakansiya moderasiyası</ButtonLink>
          <ButtonLink href="/dashboard/admin/companies" variant="secondary">Şirkət təsdiqi</ButtonLink>
        </div>
      </div>
    );
  }

  if (stats.role === "employer") {
    const s = stats.data;
    return (
      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-bold text-ink">İşəgötürən paneli</h1>
        <p className="mt-1 text-muted">Vakansiyalarını və müraciətləri buradan idarə et.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Briefcase} label="Aktiv vakansiya" value={s.openJobs} />
          <StatCard icon={Inbox} label="Ümumi müraciət" value={s.totalApps} />
          <StatCard icon={Users} label="Şirkət profili" value={s.hasCompany ? "✓" : "—"} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/dashboard/employer/post"><PlusCircle className="h-4 w-4" /> Vakansiya yerləşdir</ButtonLink>
          <ButtonLink href="/dashboard/employer/applications" variant="secondary">Müraciətlərə bax</ButtonLink>
        </div>
      </div>
    );
  }

  const s = stats.data;
  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-2xl font-bold text-ink">İş axtaran paneli</h1>
      <p className="mt-1 text-muted">Müraciətlərini izlə və yeni vakansiyalar tap.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Müraciətlərim" value={s.apps} />
        <StatCard icon={Briefcase} label="Aktiv proseslər" value={s.active} />
        <StatCard icon={Bookmark} label="Yadda saxlananlar" value={s.saved} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/jobs">Vakansiyalara bax</ButtonLink>
        <ButtonLink href="/dashboard/candidate/profile" variant="secondary">Profili tamamla</ButtonLink>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-tint text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
