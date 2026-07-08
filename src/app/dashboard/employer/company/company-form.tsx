"use client";

import { useActionState } from "react";
import { updateCompanyAction, type CompanyFormState } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { companySizes, azCities } from "@/lib/constants";

type Props = {
  initial: {
    name: string;
    logoUrl: string;
    website: string;
    industry: string;
    sizeRange: string;
    city: string;
    about: string;
  };
};

export function CompanyForm({ initial }: Props) {
  const [state, action, pending] = useActionState<CompanyFormState, FormData>(updateCompanyAction, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="name">Şirkət adı</Label>
        <Input id="name" name="name" defaultValue={initial.name} required />
        {state.fieldErrors?.name && <p className="mt-1 text-xs text-danger">{state.fieldErrors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="industry">Sahə</Label>
          <Input id="industry" name="industry" placeholder="İnformasiya texnologiyaları" defaultValue={initial.industry} />
        </div>
        <div>
          <Label htmlFor="website">Vebsayt</Label>
          <Input id="website" name="website" placeholder="https://..." defaultValue={initial.website} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sizeRange">İşçi sayı</Label>
          <Select id="sizeRange" name="sizeRange" defaultValue={initial.sizeRange}>
            <option value="">Seçilməyib</option>
            {companySizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="city">Şəhər</Label>
          <Select id="city" name="city" defaultValue={initial.city}>
            <option value="">Seçilməyib</option>
            {azCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="logoUrl">Logo URL (istəyə bağlı)</Label>
        <Input id="logoUrl" name="logoUrl" placeholder="https://.../logo.png" defaultValue={initial.logoUrl} />
      </div>

      <div>
        <Label htmlFor="about">Haqqında</Label>
        <Textarea id="about" name="about" rows={5} defaultValue={initial.about} />
      </div>

      {state.ok && <p className="text-sm text-success">Şirkət profili yeniləndi.</p>}
      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Yadda saxlanılır…" : "Yadda saxla"}
      </Button>
    </form>
  );
}
