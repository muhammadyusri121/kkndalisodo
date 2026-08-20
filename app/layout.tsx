import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// Konfigurasi Font Google (Geist Sans, Geist Mono, dan Barlow Condensed)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DEFAULT_DESCRIPTION,
  TARGET_KEYWORDS,
  generateVillageOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo";

// Konfigurasi Meta data global aplikasi & SEO Tingkat Tertinggi
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: "%s | Desa Dalisodo, Wagir, Malang",
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: TARGET_KEYWORDS,
  authors: [
    { name: "Pemerintah Desa Dalisodo", url: SITE_URL },
    { name: "Tim KKN 10 Desa Dalisodo", url: SITE_URL },
  ],
  creator: "Pemerintah Desa Dalisodo & Tim KKN 10",
  publisher: "Pemerintah Desa Dalisodo",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/assets/image/Logo_Kabupaten_Malang.svg",
        width: 800,
        height: 600,
        alt: "Logo Kabupaten Malang - Desa Dalisodo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: ["/assets/image/Logo_Kabupaten_Malang.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/image/Logo-kkn10.svg",
    shortcut: "/assets/image/Logo-kkn10.svg",
    apple: "/assets/image/Logo-kkn10.svg",
  },
  category: "Government & Tourism",
};

/**
 * Komponen RootLayout
 * 
 * Tata letak tingkat teratas (Root Layout) portal web Desa Dalisodo.
 * Menyediakan struktur dokumen HTML, pengikatan font Google, header Navbar global, serta Footer global.
 *
 * @param {Object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Komponen halaman anak (pages).
 * @returns {JSX.Element} Dokumen HTML utama.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect & DNS-Prefetch CDN Contentful untuk Kecepatan Muat Gambar */}
        <link rel="preconnect" href="https://assets.ctfassets.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.ctfassets.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.ctfassets.net" />
        <link rel="dns-prefetch" href="https://images.ctfassets.net" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} antialiased bg-carbony text-white min-h-screen flex flex-col justify-between`}
      >
        {/* Structured Data JSON-LD Global (Schema.org Organisasi Pemerintahan & WebSite) */}
        <JsonLd data={generateVillageOrganizationSchema()} />
        <JsonLd data={generateWebSiteSchema()} />

        <div>
          <Navbar />
          <main className="w-full">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}

