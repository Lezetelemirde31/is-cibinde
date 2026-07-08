// Client-safe theme constants (no server-only imports here so the toggle can
// import them). The server-side reader lives in theme-server.ts.
export type Theme = "light" | "dark";
export const THEME_COOKIE = "theme";
