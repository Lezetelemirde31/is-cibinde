import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { az, type Dictionary } from "./dictionaries/az";
import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { az, ru, en };

/** Reads the visitor's locale from the NEXT_LOCALE cookie (default: az). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Server-side dictionary for the current request's locale. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}

export { locales, defaultLocale, localeNames, localeShort, localeHtmlLang, isLocale } from "./config";
export type { Locale } from "./config";
