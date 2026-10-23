import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
import { getSettings } from "@/lib/queries";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif", display: "swap" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seo_title || `${s.business_name} — ${s.tagline ?? "Tiles, Sanitary Ware & Ceramics"}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${s.business_name}` },
    description: s.seo_description ?? undefined,
    openGraph: { siteName: s.business_name, type: "website", images: ["/logo.png"] },
  };
}
export const viewport: Viewport = { themeColor: "#071D3A", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-gold focus:p-3 focus:text-white">Skip to content</a>
        {children}
        {ga && (<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" /><Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`}</Script></>)}
      </body>
    </html>
  );
}
