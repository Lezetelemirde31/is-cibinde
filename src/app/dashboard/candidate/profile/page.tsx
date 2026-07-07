import { requireRole } from "@/lib/auth";
import { myProfile } from "@/lib/candidate/service";
import { ProfileForm } from "./profile-form";
import { CvUpload } from "./cv-upload";

export const metadata = { title: "Profil və CV" };

export default async function CandidateProfilePage() {
  await requireRole(["job_seeker"]);
  const profile = await myProfile();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Profil və CV</h1>
      <p className="mt-1 mb-6 text-muted">
        Profilini tam doldur ki, işəgötürənlər səni tapa bilsin.
      </p>
      <div className="mb-6">
        <CvUpload currentUrl={profile?.cvUrl ?? null} />
      </div>

      <ProfileForm
        initial={{
          fullName: profile?.fullName ?? "",
          headline: profile?.headline ?? null,
          phone: profile?.phone ?? null,
          city: profile?.city ?? null,
          about: profile?.about ?? null,
          skills: profile?.skills ?? [],
          openToWork: profile?.openToWork ?? true
        }}
      />
    </div>
  );
}
