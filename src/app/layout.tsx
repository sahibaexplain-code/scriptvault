import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { SITE_URL } from "@/lib/env";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ModeBanner } from "@/components/mode-banner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ScriptVault · Ready-made scripts for YouTube, Reels & documentaries", template: "%s · ScriptVault" },
  description: "Professionally written, retention-focused scripts for content creators. Hindi, Hinglish and English. Instant PDF and DOCX download.",
  openGraph: { type: "website", siteName: "ScriptVault", title: "ScriptVault · Great Videos Start With Great Scripts" },
};

export const viewport: Viewport = { themeColor: "#050407", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2">Skip to content</a>
        <CartProvider>
          <ModeBanner />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
