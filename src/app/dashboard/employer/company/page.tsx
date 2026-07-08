import { requireRole } from "@/lib/auth";
import { companyForOwner } from "@/lib/companies/service";
import { EmptyState } from "@/components/ui/empty-state";
import { CompanyForm } from "./company-form";

export const metadata = { title: "Şirkət profili" };

export default async function EmployerCompanyPage() {
  await requireRole(["employer"]);
  const company = await companyForOwner();

  if (!company) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-ink">Şirkət profili</h1>
        <EmptyState title="Şirkət tapılmadı" description="Əvvəlcə onboarding-də şirkət yaradın." className="mt-6" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Şirkət profili</h1>
      <p className="mt-1 mb-6 text-muted">
        Şirkət məlumatlarını tamamla — namizədlər sizi daha yaxşı tanısın.
      </p>
      <CompanyForm
        initial={{
          name: company.name,
          logoUrl: company.logoUrl ?? "",
          website: company.website ?? "",
          industry: company.industry ?? "",
          sizeRange: company.sizeRange ?? "",
          city: company.city ?? "",
          about: company.about ?? ""
        }}
      />
    </div>
  );
}
