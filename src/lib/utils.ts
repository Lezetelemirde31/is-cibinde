import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    ə: "e", ç: "c", ş: "s", ğ: "g", ı: "i", ö: "o", ü: "u",
    Ə: "e", Ç: "c", Ş: "s", Ğ: "g", İ: "i", Ö: "o", Ü: "u"
  };
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 200);
}

export function formatSalary(
  min: number | null,
  max: number | null,
  currency = "AZN",
  hidden = false
): string | null {
  if (hidden || (!min && !max)) return null;
  const fmt = (n: number) => new Intl.NumberFormat("az-AZ").format(n);
  if (min && max) return `${fmt(min)}–${fmt(max)} ${currency}`;
  if (min) return `${fmt(min)}+ ${currency}`;
  if (max) return `${fmt(max)} ${currency}-dək`;
  return null;
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 0) return "indicə"; // guard against clock skew (future dates)
  if (seconds < 60) return "indicə";

  // [divisor in seconds, label]. The divisor and its label must match.
  const units: Array<[number, string]> = [
    [60, "dəqiqə"],
    [3600, "saat"],
    [86400, "gün"],
    [604800, "həftə"],
    [2592000, "ay"],
    [31536000, "il"]
  ];
  for (let i = units.length - 1; i >= 0; i--) {
    const [divisor, label] = units[i];
    if (seconds >= divisor) {
      const value = Math.floor(seconds / divisor);
      return `${value} ${label} əvvəl`;
    }
  }
  return "indicə";
}
