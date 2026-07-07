"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { createJobAction } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { employmentTypeLabels, experienceLevelLabels, azCities } from "@/lib/constants";

const clientSchema = z.object({
  title: z.string().min(4, "Vəzifə adı çox qısadır"),
  description: z.string().min(30, "Təsvir ən azı 30 simvol olmalıdır"),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  employmentType: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
    "temporary",
    "remote"
  ]),
  experienceLevel: z.string().optional(),
  city: z.string().optional(),
  isRemote: z.boolean().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryHidden: z.boolean().optional(),
  skills: z.string().optional()
});

type FormValues = z.infer<typeof clientSchema>;

export function PostJobForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { employmentType: "full_time" }
  });

  async function onSubmit(values: FormValues) {
    setServerError(undefined);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.set(k, typeof v === "boolean" ? (v ? "true" : "") : String(v));
    });
    const res = await createJobAction({}, fd);
    if (res.error) return setServerError(res.error);
    if (res.fieldErrors) return setServerError(Object.values(res.fieldErrors)[0]);
    router.push("/dashboard/employer/jobs");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="title">Vəzifə adı</Label>
        <Input id="title" placeholder="Frontend Developer" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="employmentType">İş növü</Label>
          <Select id="employmentType" {...register("employmentType")}>
            {Object.entries(employmentTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="experienceLevel">Təcrübə səviyyəsi</Label>
          <Select id="experienceLevel" {...register("experienceLevel")}>
            <option value="">Seçilməyib</option>
            {Object.entries(experienceLevelLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Şəhər</Label>
          <Select id="city" {...register("city")}>
            <option value="">Seçilməyib</option>
            {azCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink">
          <input type="checkbox" {...register("isRemote")} className="h-4 w-4 rounded border-border" />
          Uzaqdan iş imkanı
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="salaryMin">Maaş (min)</Label>
          <Input id="salaryMin" type="number" inputMode="numeric" {...register("salaryMin")} />
        </div>
        <div>
          <Label htmlFor="salaryMax">Maaş (max)</Label>
          <Input id="salaryMax" type="number" inputMode="numeric" {...register("salaryMax")} />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink">
          <input type="checkbox" {...register("salaryHidden")} className="h-4 w-4 rounded border-border" />
          Maaşı gizlət
        </label>
      </div>

      <div>
        <Label htmlFor="description">İş haqqında</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description && (
          <p className="mt-1 text-xs text-danger">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="responsibilities">Vəzifə öhdəlikləri</Label>
        <Textarea id="responsibilities" rows={4} {...register("responsibilities")} />
      </div>

      <div>
        <Label htmlFor="requirements">Tələblər</Label>
        <Textarea id="requirements" rows={4} {...register("requirements")} />
      </div>

      <div>
        <Label htmlFor="skills">Bacarıqlar (vergüllə ayır)</Label>
        <Input id="skills" placeholder="React, TypeScript, Figma" {...register("skills")} />
      </div>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Yerləşdirilir…" : "Vakansiyanı dərc et"}
      </Button>
    </form>
  );
}
