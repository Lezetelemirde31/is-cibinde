import { requireRole } from "@/lib/auth";
import { PostJobForm } from "./post-job-form";

export const metadata = { title: "Vakansiya yerləşdir" };

export default async function PostJobPage() {
  await requireRole(["employer"]);
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Vakansiya yerləşdir</h1>
      <p className="mt-1 mb-6 text-muted">
        Vakansiya dərc edildikdən sonra dərhal iş axtaranlara görünəcək.
      </p>
      <PostJobForm />
    </div>
  );
}
