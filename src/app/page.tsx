import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, Bell, CheckCircle2, Building2, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { latestJobs } from "@/lib/jobs/service";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

export const revalidate = 120;

export default async function HomePage() {
  // Resilient at build/ISR time: if the API is briefly unreachable, still
  // render the page (empty state) instead of failing the whole deploy.
  const jobs = await latestJobs(6).catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-tint/60 to-surface">
        <div className="container-page grid gap-12 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Azərbaycanın iş platforması
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              İş cibində.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              Karyeranı bir toxunuşla idarə et — axtar, müraciət et, işə düzəl. İşəgötürənlər üçün
              vakansiya yerləşdirmə və namizəd axtarışı.
            </p>

            {/* Search */}
            <form action="/jobs" className="mt-8 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  name="q"
                  placeholder="Vəzifə, açar söz və ya şirkət"
                  className="h-12 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div className="relative sm:w-44">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  name="city"
                  placeholder="Şəhər"
                  className="h-12 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <button className="h-12 rounded-md bg-primary px-6 text-sm font-medium text-primary-fg transition-all hover:brightness-110">
                Axtar
              </button>
            </form>

            <div className="mt-6 flex items-center gap-6 text-sm text-muted">
              <Link href="/sign-up" className="link-muted underline-offset-4 hover:underline">
                İş axtaran kimi başla
              </Link>
              <Link href="/sign-up" className="link-muted underline-offset-4 hover:underline">
                Vakansiya yerləşdir
              </Link>
            </div>
          </div>

          {/* Signature: phone notification stack */}
          <div className="relative hidden items-center justify-center md:flex">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container-page grid gap-6 py-16 sm:grid-cols-3">
        {[
          { icon: Search, title: "Ağıllı axtarış", text: "Vəzifə, şəhər, iş növü və maaşa görə filtrlə." },
          { icon: Bell, title: "Anlıq bildirişlər", text: "Müraciətinin statusu dəyişəndə xəbərdar ol." },
          { icon: Building2, title: "Yoxlanılmış şirkətlər", text: "Yalnız təsdiqlənmiş işəgötürənlər vakansiya yerləşdirir." }
        ].map((f) => (
          <div key={f.title} className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Latest jobs */}
      <section className="container-page py-8 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">Son vakansiyalar</h2>
          <Link href="/jobs" className="text-sm font-medium text-primary hover:underline">
            Hamısına bax
          </Link>
        </div>

        {jobs.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted">
              Hələ aktiv vakansiya yoxdur. İlk vakansiyanı sən yerləşdir.
            </p>
            <ButtonLink href="/sign-up" className="mt-4">Vakansiya yerləşdir</ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}

function PhoneMockup() {
  const items = [
    { icon: CheckCircle2, tone: "text-success", title: "Müraciətin qəbul edildi", sub: "Kapital Bank · Bakı" },
    { icon: Users, tone: "text-primary", title: "Müsahibəyə dəvət", sub: "Sabah 14:00 · Onlayn" },
    { icon: Bell, tone: "text-warning", title: "3 yeni uyğun vakansiya", sub: "Frontend Developer" }
  ];
  return (
    <div className="relative w-[280px] rounded-[2.2rem] border-8 border-ink/90 bg-surface p-3 shadow-lift">
      <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-border" />
      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={it.title}
            className="animate-slide-in rounded-xl border border-border bg-panel p-3.5"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <div className="flex items-start gap-3">
              <it.icon className={`mt-0.5 h-5 w-5 shrink-0 ${it.tone}`} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{it.title}</p>
                <p className="truncate text-xs text-muted">{it.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-primary p-3 text-center text-sm font-medium text-primary-fg">
        İş cibində
      </div>
    </div>
  );
}
