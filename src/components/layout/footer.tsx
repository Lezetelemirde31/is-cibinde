import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export async function Footer() {
  const dict = await getDictionary();
  const f = dict.footer;

  const columns = [
    {
      title: f.seekers,
      links: [
        { href: "/jobs", label: dict.nav.jobs },
        { href: "/companies", label: dict.nav.companies },
        { href: "/sign-up", label: f.createProfile }
      ]
    },
    {
      title: f.employers,
      links: [
        { href: "/sign-up", label: dict.home.postJob },
        { href: "/dashboard/employer/candidates", label: f.findCandidates },
        { href: "/about", label: f.howItWorks }
      ]
    },
    {
      title: f.company,
      links: [
        { href: "/about", label: dict.nav.about },
        { href: "/blog", label: dict.nav.blog },
        { href: "/contact", label: f.contact }
      ]
    },
    {
      title: f.legal,
      links: [
        { href: "/privacy", label: f.privacy },
        { href: "/terms", label: f.terms },
        { href: "/cookies", label: f.cookies }
      ]
    }
  ];

  return (
    <footer className="mt-24 border-t border-border bg-panel">
      <div className="container-page grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm link-muted">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} İş Cibində. {f.rights}</p>
          <p className="font-display font-medium text-ink">İş cibində.</p>
        </div>
      </div>
    </footer>
  );
}
