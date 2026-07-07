import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İstifadə şərtləri",
  description: "İş Cibində platformasından istifadə şərtləri və qaydaları.",
  alternates: { canonical: "/terms" }
};

export default function Page() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="font-display text-3xl font-bold text-ink">İstifadə şərtləri</h1>
      <p className="mt-2 text-sm text-muted">Son yenilənmə: 2026-ci il</p>
      <div className="mt-8 space-y-4 text-ink/90">
        <p>Platformadan istifadə etməklə bu şərtləri qəbul etmiş olursan.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Hesab</h2>
        <p>Hesab məlumatlarının düzgünlüyünə və təhlükəsizliyinə görə istifadəçi məsuliyyət daşıyır.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Vakansiyalar</h2>
        <p>İşəgötürənlər yalnız real və qanuni vakansiyalar yerləşdirə bilər. Qaydalara zidd elanlar silinə bilər.</p>
        <h2 className="font-display text-lg font-semibold text-ink">Məsuliyyət</h2>
        <p>Platforma tərəflər arasındakı razılaşmalara görə məsuliyyət daşımır.</p>
      </div>
    </div>
  );
}
