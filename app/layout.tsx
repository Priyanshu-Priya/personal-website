import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { FloatingDock } from "@/components/ui/floating-dock";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig() || defaultGlobalConfig;
  const siteTitle = `${config.site_name} | ${config.owner_role}`;
  const siteDesc = config.site_tagline;

  return {
    metadataBase: new URL(SITE_URL),
    title: siteTitle,
    description: siteDesc,
    keywords: config.seo_keywords || ["Web Development", "AI/ML", "React.js", "Next.js"],
    authors: [{ name: config.owner_name }],
    creator: config.owner_name,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: siteTitle,
      description: siteDesc,
      siteName: config.site_name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDesc,
    },
  };
}

import { getSiteConfig, defaultGlobalConfig } from "@/lib/content";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig() || defaultGlobalConfig;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-slate-950 text-slate-100`}
      >
        {/*
          FloatingDock uses React Portal - it renders itself directly into
          document.body, completely bypassing any stacking context issues
          from page content. It's declared here but renders independently.
        */}
        <FloatingDock config={config} />

        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
