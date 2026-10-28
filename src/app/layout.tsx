import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { SiteShell } from "@/components/layout/site-shell";
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
  title: {
    default: "UI Atlas — Interface library",
    template: "%s | UI Atlas",
  },
  description:
    "A personal, searchable library for interface patterns, components, and visual ideas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[inter.variable, pixelify.variable, jetBrainsMono.variable].join(" ")}
    >
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
