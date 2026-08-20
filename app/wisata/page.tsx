import Link from "next/link";
import WisataCard from "@/components/features/wisata/WisataCard";
import { getWisataList } from "@/server/services/wisataService";

import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

// Meta data halaman katalog wisata desa (SEO Google & Social Sharing)
export const metadata: Metadata = {
  title: "Destinasi Wisata & Potensi Alam Desa Dalisodo Lereng Kawi",
  description:
    "Jelajahi keindahan destinasi wisata alam Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang. Temukan pesona pegunungan Putri Tidur lereng Gunung Kawi, air terjun alami, hutan pinus, agrowisata, dan spot foto terbaik.",
  keywords: [
    "Wisata Desa Dalisodo",
    "Wisata Alam Wagir Malang",
    "Pegunungan Putri Tidur",
    "Wisata Lereng Gunung Kawi",
    "Agrowisata Dalisodo",
    "Air Terjun Dalisodo",
    "Hutan Pinus Dalisodo",
    "Desa Wisata Kabupaten Malang",
    "Wisata Alam Malang Murah",
    "Spot Foto Dalisodo",
  ],
  alternates: {
    canonical: "/wisata",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/wisata`,
    siteName: SITE_NAME,
    title: "Destinasi Wisata & Potensi Alam Desa Dalisodo Lereng Kawi",
    description:
      "Daftar destinasi wisata alam, pegunungan lereng Kawi, dan potensi agrowisata Desa Dalisodo, Wagir, Malang.",
    images: [
      {
        url: "/assets/image/Logo_Kabupaten_Malang.svg",
        width: 800,
        height: 600,
        alt: "Wisata Alam Desa Dalisodo - Wagir, Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Destinasi Wisata & Potensi Alam Desa Dalisodo Lereng Kawi",
    description:
      "Daftar tempat wisata alam dan potensi agrowisata Desa Dalisodo, Wagir, Malang.",
    images: ["/assets/image/Logo_Kabupaten_Malang.svg"],
  },
};

/**
 * Halaman Wisata (WisataPage)
 * 
 * Halaman katalog destinasi wisata alam dan potensi agrowisata Desa Dalisodo.
 * Mengambil daftar tempat wisata dari server service Contentful secara asinkron.
 *
 * @returns {Promise<JSX.Element>} Halaman katalog wisata.
 */
export default async function WisataPage() {
  const wisataList = await getWisataList();

  return (
    <main id="wisata-main-page" className="w-full bg-white min-h-screen">
      {/* Schema Breadcrumb & CollectionPage untuk Google Search */}
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Wisata Desa", url: "/wisata" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Destinasi Wisata & Potensi Alam Desa Dalisodo",
            description: "Daftar tempat wisata alam, pegunungan lereng Kawi, dan potensi agrowisata Desa Dalisodo, Wagir, Malang.",
            url: `${SITE_URL}/wisata`,
          },
        ]}
      />
      {/* Banner Header Halaman (Dark Hero Stage) */}
      <header
        id="wisata-header-banner"
        className="w-full bg-carbon-deep text-white pt-28 sm:pt-36 pb-16 sm:pb-20 px-6 sm:px-12 lg:px-16 border-b border-anvil"
      >
        <div className="max-w-360 mx-auto space-y-4">
          {/* Navigasi Jejak Halaman (Breadcrumb) */}
          <nav
            aria-label="Breadcrumb"
            className="font-lambo text-xs tracking-[0.15em] text-giallo uppercase font-bold flex items-center gap-2"
          >
            <Link href="/" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 inline-block">
              BERANDA
            </Link>
            <span>/</span>
            <span className="text-slate-400">WISATA DESA</span>
          </nav>

          {/* Judul & Subtitle Halaman */}
          <h1 className="font-lambo text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-white leading-tight w-full max-w-none">
            WISATA & POTENSI ALAM DALISODO
          </h1>

          <p className="font-lambo text-xs sm:text-sm text-slate-300 uppercase tracking-[0.023em] w-full max-w-none leading-relaxed">
            MENJELAJAHI KEINDAHAN ALAM LERENG GUNUNG KAWI, AIR TERJUN ALAMI, HUTAN PINUS RINDANG, SERTA AGROWISATA KHAS DESA DALISODO KABUPATEN MALANG.
          </p>
        </div>
      </header>

      {/* Seksi Katalog Wisata (Grid 4 Kolom) */}
      <section
        id="wisata-catalog-section"
        aria-label="Katalog Wisata Dalisodo"
        className="w-full py-12 sm:py-16 px-6 sm:px-12 lg:px-16 max-w-360 mx-auto"
      >
        {/* Header Seksi Katalog */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-carbony mb-8 sm:mb-12">
          <div>
            <h2 className="font-lambo text-3xl sm:text-4xl font-bold uppercase tracking-[0.023em] text-carbony">
              DAFTAR DESTINASI WISATA
            </h2>
          </div>
          <p className="font-lambo text-xs text-steel uppercase tracking-[0.023em]">
            MENAMPILKAN {wisataList.length} WISATA
          </p>
        </div>

        {/* Grid Kartu Wisata / State Kosong */}
        {wisataList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-ash/20">
            <p className="font-lambo text-sm text-steel uppercase tracking-wider">
              BELUM ADA DATA DESTINASI WISATA TERSEDIA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wisataList.map((item) => (
              <WisataCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

