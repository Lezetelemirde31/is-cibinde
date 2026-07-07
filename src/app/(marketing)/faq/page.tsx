import type { Metadata } from "next";
import { listFaqs } from "@/lib/content/service";

export const metadata: Metadata = {
  title: "Tez-tez verilən suallar",
  description: "İş axtaranlar və işəgötürənlər üçün ən çox verilən suallar və cavablar.",
  alternates: { canonical: "/faq" }
};
export const revalidate = 3600;

export default async function FaqPage() {
  const items = await listFaqs().catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };

  return (
    <div className="container-page max-w-3xl py-14">
      {items.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <h1 className="font-display text-3xl font-bold text-ink">Tez-tez verilən suallar</h1>
      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-muted">Suallar tezliklə əlavə olunacaq.</p>
        ) : (
          items.map((f) => (
            <details key={f.id} className="group rounded-lg border border-border bg-surface p-5 shadow-card">
              <summary className="cursor-pointer list-none font-display font-semibold text-ink">
                {f.question}
              </summary>
              <p className="mt-2 text-sm text-ink/90">{f.answer}</p>
            </details>
          ))
        )}
      </div>
    </div>
  );
}
