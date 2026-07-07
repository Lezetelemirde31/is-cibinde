import Link from "next/link";

const columns = [
  {
    title: "İş axtaranlar",
    links: [
      { href: "/jobs", label: "Vakansiyalar" },
      { href: "/companies", label: "Şirkətlər" },
      { href: "/sign-up", label: "Profil yarat" }
    ]
  },
  {
    title: "İşəgötürənlər",
    links: [
      { href: "/sign-up", label: "Vakansiya yerləşdir" },
      { href: "/dashboard/employer/candidates", label: "Namizəd axtar" },
      { href: "/about", label: "Necə işləyir" }
    ]
  },
  {
    title: "Şirkət",
    links: [
      { href: "/about", label: "Haqqımızda" },
      { href: "/blog", label: "Bloq" },
      { href: "/contact", label: "Əlaqə" }
    ]
  },
  {
    title: "Hüquqi",
    links: [
      { href: "/privacy", label: "Məxfilik siyasəti" },
      { href: "/terms", label: "İstifadə şərtləri" },
      { href: "/cookies", label: "Kuki siyasəti" }
    ]
  }
];

export function Footer() {
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
          <p>© {new Date().getFullYear()} İş Cibində. Bütün hüquqlar qorunur.</p>
          <p className="font-display font-medium text-ink">İş cibində.</p>
        </div>
      </div>
    </footer>
  );
}
