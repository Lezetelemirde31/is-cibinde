import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuki siyasəti",
  description: "İş Cibində kukilərdən necə istifadə edir və seçimlərinizi necə idarə edə bilərsiniz.",
  alternates: { canonical: "/cookies" }
};

export default function Page() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Kuki siyasəti</h1>
      <p className="mt-2 text-sm text-muted">Son yenilənmə: 2026-ci il</p>
      <div className="mt-8 space-y-4 text-ink/90">
        <p>İş Cibində saytın düzgün işləməsi və təcrübənin yaxşılaşdırılması üçün kukilərdən istifadə edir.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Zəruri kukilər</h2>
        <p>Sessiya və təhlükəsizlik üçün istifadə olunur və söndürülə bilməz.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Analitik kukilər</h2>
        <p>Saytdan istifadəni anlamaq və xidməti təkmilləşdirmək üçün istifadə olunur.</p>
      </div>
    </div>
  );
}
