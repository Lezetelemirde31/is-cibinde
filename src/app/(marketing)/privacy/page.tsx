import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Məxfilik siyasəti",
  description: "İş Cibində şəxsi məlumatlarınızı necə toplayır, istifadə edir və qoruyur.",
  alternates: { canonical: "/privacy" }
};

export default function Page() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Məxfilik siyasəti</h1>
      <p className="mt-2 text-sm text-muted">Son yenilənmə: 2026-ci il</p>
      <div className="mt-8 space-y-4 text-ink/90">
        <p>Bu məxfilik siyasəti İş Cibində platformasının istifadəçi məlumatlarını necə topladığını, istifadə etdiyini və qoruduğunu izah edir.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Topladığımız məlumatlar</h2>
        <p>Ad, e-poçt, telefon, CV, profil məlumatları və platformadan istifadə zamanı yaranan texniki məlumatlar.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Məlumatların istifadəsi</h2>
        <p>Məlumatlar yalnız xidmətin göstərilməsi, hesabın idarə olunması və istifadəçi təcrübəsinin yaxşılaşdırılması üçün istifadə olunur.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Hüquqların</h2>
        <p>İstənilən vaxt məlumatlarına baxa, onları düzəldə və ya hesabının silinməsini tələb edə bilərsən.</p>
      </div>
    </div>
  );
}
