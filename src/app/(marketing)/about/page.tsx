import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description: "İş Cibində — Azərbaycanda iş axtaranları və işəgötürənləri bir araya gətirən platforma.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Haqqımızda</h1>
      <div className="mt-6 space-y-4 text-ink/90">
        <p>
          İş Cibində Azərbaycanda iş axtaranları və işəgötürənləri bir araya gətirən müasir işə qəbul
          platformasıdır. Məqsədimiz iş axtarışını sadə, sürətli və şəffaf etməkdir.
        </p>
        <p>
          İş axtaranlar profil yaradır, CV yükləyir, vakansiyalara müraciət edir və müraciətlərinin
          gedişatını bir yerdən izləyir. İşəgötürənlər vakansiya yerləşdirir, müraciətləri idarə edir
          və uyğun namizədləri tapır.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <h2 className="font-display font-semibold text-ink">İş axtaranlar üçün</h2>
          <p className="mt-1 text-sm text-muted">Pulsuz profil, CV və müraciət izləmə.</p>
          <ButtonLink href="/sign-up" size="sm" className="mt-4">Başla</ButtonLink>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <h2 className="font-display font-semibold text-ink">İşəgötürənlər üçün</h2>
          <p className="mt-1 text-sm text-muted">Vakansiya yerləşdir və namizəd axtar.</p>
          <ButtonLink href="/sign-up" size="sm" variant="secondary" className="mt-4">Vakansiya yerləşdir</ButtonLink>
        </div>
      </div>
    </div>
  );
}
