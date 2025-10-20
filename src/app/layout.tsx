import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { StructuredData } from "@/components/seo/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.teambuildingmetimpact.nl"),
  title: {
    default: "Teambuilding met Impact | Betekenisvolle teambuilding met LEGO® Serious Play",
    template: "%s | Teambuilding met Impact",
  },
  description:
    "Teambuilding met Impact ontwerpt betekenisvolle teamdagen waarin LEGO® Serious Play en maatschappelijke projecten zorgen voor verbinding, energie en tastbare impact.",
  keywords: [
    "teambuilding",
    "LEGO Serious Play",
    "maatschappelijke impact",
    "teamontwikkeling",
    "Haarlemmermeer",
    "bedrijfsevenement",
  ],
  verification: {
    google: "U6UBu2rmVGHruB-OvnSyzL_E0IvnM_z6EI_iinRfgRg",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://www.teambuildingmetimpact.nl",
    siteName: "Teambuilding met Impact",
    title: "Teambuilding met Impact | Betekenisvolle teambuilding met LEGO® Serious Play",
    description:
      "Betekenisvolle teambuilding met LEGO® Serious Play en maatschappelijke projecten. Bouw aan sterke teams én een betere wereld.",
    images: [
      {
        url: "https://www.teambuildingmetimpact.nl/images/hero-collaboration.png",
        width: 1920,
        height: 1080,
        alt: "Team dat samenwerkt tijdens een LEGO® Serious Play sessie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teambuilding met Impact",
    description:
      "Betekenisvolle teambuilding met LEGO® Serious Play en maatschappelijke projecten. Bouw aan sterke teams én een betere wereld.",
    images: ["https://www.teambuildingmetimpact.nl/images/hero-collaboration.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "nl-NL": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full">
      <head>
        <GoogleAnalytics />
        <StructuredData />
      </head>
      <body className={`${inter.variable} h-full bg-neutral-50 text-neutral-900`}>
        <AppProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
