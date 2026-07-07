import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { env } from "@/lib/env";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "İş Cibində — Azərbaycanda iş elanları və vakansiyalar",
    template: "%s · İş Cibində"
  },
  description:
    "Azərbaycanda iş axtar, vakansiyalara müraciət et və işə düzəl. İşəgötürənlər üçün vakansiya yerləşdirmə və namizəd axtarışı.",
  openGraph: { type: "website", locale: "az_AZ", siteName: "İş Cibində" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  applicationName: "İş Cibində",
  keywords: ["iş elanları", "vakansiya", "iş axtar", "Azərbaycan", "işə qəbul", "karyera"]
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" }
  ],
  colorScheme: "light"
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "İş Cibində",
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    "Azərbaycanda iş axtaranları və işəgötürənləri bir araya gətirən işə qəbul platforması."
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "İş Cibində",
  url: env.NEXT_PUBLIC_SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${env.NEXT_PUBLIC_SITE_URL}/jobs?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="az" className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          />
        </head>
        <body className="min-h-screen font-sans antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-fg"
          >
            Əsas məzmuna keç
          </a>
          <Providers>
            <Navbar />
            <main id="main-content" className="min-h-[60vh]">
              {children}
            </main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
