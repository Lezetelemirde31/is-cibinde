import type { Appearance } from "@clerk/types";

// Matches Clerk's widget to the İş Cibində design tokens (white/blue).
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "hsl(224 76% 48%)",
    colorText: "hsl(217 33% 12%)",
    colorBackground: "hsl(0 0% 100%)",
    borderRadius: "10px",
    fontFamily: "var(--font-body)"
  },
  elements: {
    rootBox: "w-full",
    card: "shadow-none border-0 p-0 bg-transparent",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    formButtonPrimary:
      "bg-primary hover:brightness-110 text-primary-fg text-sm normal-case font-medium h-11",
    formFieldInput: "h-11 border-border",
    footerAction: "text-sm"
  }
};
