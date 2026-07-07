import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { listCompanies } from "@/lib/companies/service";

export const metadata: Metadata = {
  title: "Şirkətlər",
  description: "Azərbaycanda vakansiya yerləşdirən yoxlanılmış şirkətlər.",
  alternates: { canonical: "/companies" },
  openGraph: {
    title: "Şirkətlər · İş Cibində",
    description: "Azərbaycanda vakansiya yerləşdirən yoxlanılmış şirkətlər.",
    type: "website"
  }
};

export default async function CompaniesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const { items } = await listCompanies({ q: sp.q, page: Number(sp.page ?? 1) || 1 });

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Şirkətlər</h1>
      <p className="mt-1 mb-6 text-muted">Yoxlanılmış işəgötürənləri kəşf et.</p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-16 text-center text-muted">
          Hələ yoxlanılmış şirkət yoxdur.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.slug}`}
              className="rounded-lg border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-border bg-panel">
                {c.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logoUrl} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <h2 className="mt-3 font-display font-semibold text-ink">{c.name}</h2>
              <p className="text-sm text-muted">{c.industry ?? "—"}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {c.city ?? "Azərbaycan"}
                </span>
                <span className="font-medium text-primary">{c.openJobs} vakansiya</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
