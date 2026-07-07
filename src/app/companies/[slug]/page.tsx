import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Globe, MapPin, Users, BadgeCheck } from "lucide-react";
import { getCompanyBySlug } from "@/lib/companies/service";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCompanyBySlug(slug);
  if (!data) return { title: "Şirkət tapılmadı" };
  return {
    title: data.company.name,
    description: data.company.about?.slice(0, 155) ?? `${data.company.name} vakansiyaları`,
    alternates: { canonical: `/companies/${slug}` }
  };
}

export default async function CompanyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCompanyBySlug(slug);
  if (!data) notFound();
  const { company, openJobs: jobItems } = data;

  return (
    <div className="container-page py-10">
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-panel">
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-7 w-7 text-primary" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{company.name}</h1>
            {company.status === "verified" && (
              <span title="Yoxlanılıb"><BadgeCheck className="h-5 w-5 text-primary" /></span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            {company.industry && <Badge>{company.industry}</Badge>}
            {company.city && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.city}</span>
            )}
            {company.sizeRange && (
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {company.sizeRange}</span>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                <Globe className="h-4 w-4" /> Vebsayt
              </a>
            )}
          </div>
        </div>
      </div>

      {company.about && <p className="mt-6 max-w-2xl text-ink/90">{company.about}</p>}

      <h2 className="mb-4 mt-10 font-display text-xl font-bold text-ink">
        Açıq vakansiyalar ({jobItems.length})
      </h2>
      {jobItems.length === 0 ? (
        <p className="text-muted">Bu şirkətin hazırda açıq vakansiyası yoxdur.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobItems.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
