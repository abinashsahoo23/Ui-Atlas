import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-ui-sans",
  weight: "100 900",
  display: "swap",
});
const pixelify = localFont({
  src: "./fonts/PixelifySans-Variable.woff2",
  variable: "--font-display",
  weight: "400 700",
  display: "swap",
});
const jetBrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-ui-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UI Atlas — Interface library",
    template: "%s | UI Atlas",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "UI Atlas — React UI Components and Interface Patterns",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "UI Atlas — React interface studies and component previews",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UI Atlas — React UI Components and Interface Patterns",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[inter.variable, pixelify.variable, jetBrainsMono.variable].join(" ")}
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/library?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
