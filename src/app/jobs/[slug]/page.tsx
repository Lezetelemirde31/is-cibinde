import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Wifi, Building2, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getJobBySlug, incrementJobView } from "@/lib/jobs/service";
import { getCurrentUser } from "@/lib/auth";
import { hasApplied } from "@/lib/applications/service";
import { formatSalary, timeAgo } from "@/lib/utils";
import { employmentTypeLabels, experienceLevelLabels } from "@/lib/constants";
import { getDictionary, getLocale } from "@/lib/i18n";
import { env } from "@/lib/env";
import { ApplySection } from "./apply-section";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Vakansiya tapılmadı" };
  return {
    title: `${job.title} — ${job.company.name}`,
    description: job.description.slice(0, 155),
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} — ${job.company.name}`,
      description: job.description.slice(0, 155),
      type: "article"
    }
  };
}

function paragraphs(text: string | null) {
  if (!text) return null;
  return text.split(/\n{2,}|\n/).filter(Boolean);
}

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.status !== "active") notFound();

  const { company, category } = job;
  await incrementJobView(job.id);

  const [user, dict, locale] = await Promise.all([getCurrentUser(), getDictionary(), getLocale()]);
  const applied = user?.role === "job_seeker" ? await hasApplied(job.id) : false;
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryHidden);
  const jd = dict.jobDetail;
  const categoryName = category
    ? locale === "ru"
      ? category.nameRu ?? category.nameAz
      : locale === "en"
        ? category.nameEn ?? category.nameAz
        : category.nameAz
    : null;

  // Google Jobs structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: new Date(job.publishedAt ?? job.createdAt).toISOString(),
    ...(job.expiresAt ? { validThrough: new Date(job.expiresAt).toISOString() } : {}),
    employmentType: job.employmentType.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
      ...(company.website ? { sameAs: company.website } : {})
    },
    jobLocation: job.isRemote
      ? undefined
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.city ?? "Bakı",
            addressCountry: "AZ"
          }
        },
    ...(job.isRemote ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(salary && job.salaryMin
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salaryCurrency,
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin,
              maxValue: job.salaryMax ?? job.salaryMin,
              unitText: "MONTH"
            }
          }
        }
      : {}),
    url: `${env.NEXT_PUBLIC_SITE_URL}/jobs/${job.slug}`
  };

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/jobs" className="link-muted">{dict.nav.jobs}</Link>
        <span>/</span>
        <span className="text-ink">{job.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-panel">
              {company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-semibold text-primary">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{job.title}</h1>
              <Link
                href={`/companies/${company.slug}`}
                className="mt-1 inline-flex items-center gap-1.5 text-muted hover:text-primary"
              >
                <Building2 className="h-4 w-4" /> {company.name}
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="primary">{employmentTypeLabels[job.employmentType]}</Badge>
            {job.experienceLevel && (
              <Badge>{experienceLevelLabels[job.experienceLevel]}</Badge>
            )}
            {job.city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-0.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" /> {job.city}
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2.5 py-0.5 text-xs text-primary">
                <Wifi className="h-3.5 w-3.5" /> {jd.remote}
              </span>
            )}
            {categoryName && <Badge>{categoryName}</Badge>}
          </div>

          <article className="mt-8 space-y-6">
            <Section title={jd.about}>
              {paragraphs(job.description)?.map((p, i) => (
                <p key={i} className="text-ink/90">{p}</p>
              ))}
            </Section>
            {job.responsibilities && (
              <Section title={jd.responsibilities}>
                {paragraphs(job.responsibilities)?.map((p, i) => (
                  <p key={i} className="text-ink/90">{p}</p>
                ))}
              </Section>
            )}
            {job.requirements && (
              <Section title={jd.requirements}>
                {paragraphs(job.requirements)?.map((p, i) => (
                  <p key={i} className="text-ink/90">{p}</p>
                ))}
              </Section>
            )}
            {job.skills.length > 0 && (
              <Section title={jd.skills}>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </Section>
            )}
          </article>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <dl className="space-y-3 text-sm">
              <Row icon={Briefcase} label={jd.employmentType} value={employmentTypeLabels[job.employmentType]} />
              <Row icon={MapPin} label={jd.location} value={job.isRemote ? jd.remote : job.city ?? "—"} />
              <Row
                icon={Clock}
                label={jd.posted}
                value={job.publishedAt ? timeAgo(job.publishedAt) : timeAgo(job.createdAt)}
              />
            </dl>
            {salary && (
              <div className="mt-4 rounded-md bg-primary-tint p-3 text-center">
                <span className="font-display text-lg font-semibold text-primary">{salary}</span>
                <p className="text-xs text-muted">{jd.monthly}</p>
              </div>
            )}
          </div>

          <ApplySection
            jobId={job.id}
            isAuthenticated={Boolean(user)}
            canApply={user?.role === "job_seeker"}
            alreadyApplied={applied}
            labels={{ ...dict.apply, signIn: dict.nav.signIn, signUp: dict.nav.signUp }}
          />
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="inline-flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" /> {label}
      </dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
