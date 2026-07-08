import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables in globals.css so light/dark swap cleanly
        ink: "hsl(var(--ink) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        panel: "hsl(var(--panel) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          fg: "hsl(var(--primary-fg) / <alpha-value>)",
          tint: "hsl(var(--primary-tint) / <alpha-value>)"
        },
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "7px"
      },
      boxShadow: {
        card: "0 1px 2px hsl(220 40% 12% / 0.04), 0 6px 24px -12px hsl(220 40% 12% / 0.12)",
        lift: "0 12px 40px -16px hsl(224 76% 40% / 0.28)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in": "slide-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left": "slide-in-left 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.2s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
