import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const [user, dict] = await Promise.all([getCurrentUser(), getDictionary()]);
  if (user) redirect("/dashboard");

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Blue brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-fg lg:flex">
        <Link href="/" className="font-display text-xl font-bold">İş Cibində</Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            {dict.auth.panelHeading}
          </h2>
          <p className="mt-4 max-w-md text-primary-fg/80">{dict.auth.panelText}</p>
        </div>
        <p className="text-sm text-primary-fg/70">© {new Date().getFullYear()} İş Cibində</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />
      </div>

      {/* White form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
