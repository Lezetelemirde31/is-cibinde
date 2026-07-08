export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";

export const localeNames: Record<Locale, string> = {
  az: "Azərbaycanca",
  ru: "Русский",
  en: "English"
};

/** Short label shown in the compact switcher. */
export const localeShort: Record<Locale, string> = {
  az: "AZ",
  ru: "RU",
  en: "EN"
};

/** BCP-47 tags for the <html lang> attribute. */
export const localeHtmlLang: Record<Locale, string> = {
  az: "az",
  ru: "ru",
  en: "en"
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
