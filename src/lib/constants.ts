// Human-readable Azerbaijani labels for enum values used across the UI.

export const employmentTypeLabels: Record<string, string> = {
  full_time: "Tam ştat",
  part_time: "Yarım ştat",
  contract: "Müqavilə",
  internship: "Təcrübə",
  temporary: "Müvəqqəti",
  remote: "Uzaqdan"
};

export const experienceLevelLabels: Record<string, string> = {
  entry: "Təcrübəsiz",
  junior: "Junior",
  mid: "Orta",
  senior: "Senior",
  lead: "Lead",
  executive: "Rəhbər"
};

export const applicationStatusLabels: Record<string, string> = {
  submitted: "Göndərildi",
  viewed: "Baxıldı",
  shortlisted: "Seçilmişlər",
  interview: "Müsahibə",
  offer: "Təklif",
  hired: "İşə qəbul",
  rejected: "İmtina",
  withdrawn: "Geri çəkildi"
};

export const applicationStatusTone: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  submitted: "neutral",
  viewed: "primary",
  shortlisted: "primary",
  interview: "warning",
  offer: "warning",
  hired: "success",
  rejected: "danger",
  withdrawn: "neutral"
};

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";

export const jobStatusLabels: Record<string, string> = {
  active: "Aktiv",
  pending_review: "Moderasiyada",
  closed: "Bağlı",
  rejected: "Rədd edilib",
  expired: "Vaxtı bitib",
  draft: "Qaralama"
};

export const jobStatusTone: Record<string, BadgeTone> = {
  active: "success",
  pending_review: "warning",
  closed: "neutral",
  rejected: "danger",
  expired: "neutral",
  draft: "neutral"
};

export const companyStatusLabels: Record<string, string> = {
  verified: "Təsdiqlənib",
  pending_verification: "Gözləyir",
  unverified: "Yoxlanılmayıb",
  rejected: "Rədd edilib"
};

export const companyStatusTone: Record<string, BadgeTone> = {
  verified: "success",
  pending_verification: "warning",
  unverified: "neutral",
  rejected: "danger"
};

export const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

export const azCities = [
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", "Şirvan", "Naxçıvan",
  "Şəki", "Lənkəran", "Quba", "Şamaxı", "Gədəbəy", "Bərdə"
];
