import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Səhifə tapılmadı</h1>
      <p className="mt-2 text-muted">Axtardığın səhifə mövcud deyil və ya köçürülüb.</p>
      <ButtonLink href="/" className="mt-6">Ana səhifəyə qayıt</ButtonLink>
    </div>
  );
}
