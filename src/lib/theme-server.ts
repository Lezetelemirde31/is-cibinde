import "server-only";
import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "./theme";

/** Reads the visitor's theme from the `theme` cookie (default: light). */
export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}
