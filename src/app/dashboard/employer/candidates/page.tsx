import { requireRole } from "@/lib/auth";
import { searchCandidates, savedCandidateIds } from "@/lib/candidates/service";
import { Badge } from "@/components/ui/badge";
import { experienceLevelLabels } from "@/lib/constants";
import { CandidateSearch } from "./candidate-search";
import { SaveCandidateButton } from "./save-candidate-button";

export const metadata = { title: "Namizədlər" };

export default async function CandidatesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; city?: string; page?: string }>;
}) {
  await requireRole(["employer"]);
  const sp = await searchParams;
  const [candidates, saved] = await Promise.all([
    searchCandidates({ q: sp.q, city: sp.city, page: Number(sp.page ?? 1) || 1 }),
    savedCandidateIds()
  ]);

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-bold text-ink">Namizədlər</h1>
      <p className="mb-6 text-muted">İşə açıq namizədləri axtar və yadda saxla.</p>

      <CandidateSearch />

      <div className="mt-6 space-y-3">
        {candidates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted">
            Bu meyarlara uyğun namizəd tapılmadı.
          </div>
        ) : (
          candidates.map((c) => (
            <div key={c.userId} className="rounded-lg border border-border bg-surface p-4 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-ink">{c.fullName}</p>
                  <p className="text-sm text-muted">
                    {c.headline ?? "—"}
                    {c.city ? ` · ${c.city}` : ""}
                    {c.experienceLevel ? ` · ${experienceLevelLabels[c.experienceLevel]}` : ""}
                  </p>
                  {c.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.skills.slice(0, 8).map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SaveCandidateButton candidateId={c.userId} initiallySaved={saved.has(c.userId)} />
                  <a href={`mailto:${c.email}`} className="text-sm font-medium text-primary hover:underline">
                    Əlaqə
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
