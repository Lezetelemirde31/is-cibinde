"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  initial: {
    fullName: string;
    headline: string | null;
    phone: string | null;
    city: string | null;
    about: string | null;
    skills: string[];
    openToWork: boolean;
  };
};

export function ProfileForm({ initial }: Props) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfileAction, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="fullName">Ad, soyad</Label>
        <Input id="fullName" name="fullName" defaultValue={initial.fullName} required />
        {state.fieldErrors?.fullName && (
          <p className="mt-1 text-xs text-danger">{state.fieldErrors.fullName}</p>
        )}
      </div>
      <div>
        <Label htmlFor="headline">Başlıq</Label>
        <Input id="headline" name="headline" placeholder="Frontend Developer" defaultValue={initial.headline ?? ""} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" defaultValue={initial.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="city">Şəhər</Label>
          <Input id="city" name="city" defaultValue={initial.city ?? ""} />
        </div>
      </div>
      <div>
        <Label htmlFor="about">Haqqımda</Label>
        <Textarea id="about" name="about" rows={5} defaultValue={initial.about ?? ""} />
      </div>
      <div>
        <Label htmlFor="skills">Bacarıqlar (vergüllə ayır)</Label>
        <Input id="skills" name="skills" defaultValue={initial.skills.join(", ")} />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="openToWork" defaultChecked={initial.openToWork} className="h-4 w-4 rounded border-border" />
        İş təkliflərinə açığam
      </label>

      {state.ok && <p className="text-sm text-success">Profil yeniləndi.</p>}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Yadda saxlanılır…" : "Yadda saxla"}
      </Button>
    </form>
  );
}
