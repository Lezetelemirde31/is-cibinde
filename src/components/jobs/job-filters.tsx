"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { employmentTypeLabels, experienceLevelLabels, azCities } from "@/lib/constants";

export function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/jobs?${next.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4">
      <form
        className="relative sm:col-span-2 lg:col-span-1"
        onSubmit={(e) => {
          e.preventDefault();
          const value = new FormData(e.currentTarget).get("q") as string;
          update("q", value ?? "");
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input name="q" defaultValue={params.get("q") ?? ""} placeholder="Axtar" className="pl-9" />
      </form>

      <Select
        defaultValue={params.get("employmentType") ?? ""}
        onChange={(e) => update("employmentType", e.target.value)}
        aria-label="İş növü"
      >
        <option value="">İş növü — hamısı</option>
        {Object.entries(employmentTypeLabels).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </Select>

      <Select
        defaultValue={params.get("experienceLevel") ?? ""}
        onChange={(e) => update("experienceLevel", e.target.value)}
        aria-label="Təcrübə"
      >
        <option value="">Təcrübə — hamısı</option>
        {Object.entries(experienceLevelLabels).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </Select>

      <Select
        defaultValue={params.get("city") ?? ""}
        onChange={(e) => update("city", e.target.value)}
        aria-label="Şəhər"
      >
        <option value="">Şəhər — hamısı</option>
        {azCities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
    </div>
  );
}
