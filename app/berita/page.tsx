import Link from "next/link";
import BeritaCard from "@/components/features/berita/BeritaCard";
import { getBeritaList } from "@/server/services/beritaService";

import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

// Meta data halaman katalog berita kegiatan (SEO Google & Social Sharing)
export const metadata: Metadata = {
  title: "Berita & Dokumentasi Kegiatan Desa Dalisodo",
  description:
    "Kumpulan berita terkini, publikasi kegiatan warga, pengumuman desa, dan dokumentasi program pengabdian masyarakat KKN 10 Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang.",
  keywords: [
    "Berita Desa Dalisodo",
    "Kegiatan Desa Dalisodo",
    "Kabar Dalisodo Wagir",
    "KKN 10 Dalisodo",
    "Dokumentasi Desa Dalisodo",
    "Pengumuman Desa Dalisodo",
    "Info Malang Terkini",
    "Pemerintah Desa Dalisodo Wagir",
  ],
  alternates: {
    canonical: "/berita",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/berita`,
    siteName: SITE_NAME,
    title: "Berita & Dokumentasi Kegiatan Desa Dalisodo",
    description:
      "Informasi terbaru kegiatan masyarakat, program desa, dan publikasi KKN 10 Desa Dalisodo, Wagir, Malang.",
    images: [
      {
        url: "/assets/image/Logo_Kabupaten_Malang.svg",
        width: 800,
        height: 600,
        alt: "Berita & Kegiatan Desa Dalisodo - Wagir, Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita & Dokumentasi Kegiatan Desa Dalisodo",
    description:
      "Kumpulan artikel berita terkini dan dokumentasi program Desa Dalisodo, Wagir, Malang.",
    images: ["/assets/image/Logo_Kabupaten_Malang.svg"],
  },
};

/**
 * Halaman Berita (BeritaPage)
 * 
 * Halaman katalog publikasi artikel berita kegiatan dan laporan program Desa Dalisodo.
 * Mengambil seluruh daftar berita dari layanan server Contentful secara asinkron.
 *
 * @returns {Promise<JSX.Element>} Halaman katalog berita.
 */
export default async function BeritaPage() {
  const beritaList = await getBeritaList();

  return (
    <main id="berita-main-page" className="w-full bg-white min-h-screen">
      {/* Schema Breadcrumb & CollectionPage untuk Google Search */}
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Berita Kegiatan", url: "/berita" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Berita & Dokumentasi Kegiatan Desa Dalisodo",
            description: "Kumpulan artikel berita terkini dan dokumentasi program Desa Dalisodo, Wagir, Malang.",
            url: `${SITE_URL}/berita`,
          },
        ]}
      />
      {/* Banner Header Halaman (Dark Hero Stage) */}
      <header
        id="berita-header-banner"
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
            <span className="text-slate-400">BERITA KEGIATAN</span>
          </nav>

          {/* Judul & Subtitle Halaman */}
          <h1 className="font-lambo text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-white leading-tight w-full max-w-none">
            BERITA & DOKUMENTASI KEGIATAN
          </h1>

          <p className="font-lambo text-xs sm:text-sm text-slate-300 uppercase tracking-[0.023em] w-full max-w-none leading-relaxed">
            Kilas informasi terbaru mengenai potensi wisata, kegiatan masyarakat, dan beragan cerita dari Desa Dalisodo.
          </p>
        </div>
      </header>

      {/* Seksi Katalog Berita (Grid 4 Kolom) */}
      <section
        id="berita-catalog-section"
        aria-label="Katalog Berita Dalisodo"
        className="w-full py-12 sm:py-16 px-6 sm:px-12 lg:px-16 max-w-360 mx-auto"
      >
        {/* Header Seksi Katalog */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-carbony mb-8 sm:mb-12">
          <div>
            <h2 className="font-lambo text-3xl sm:text-4xl font-bold uppercase tracking-[0.023em] text-carbony">
              KUMPULAN ARTIKEL BERITA
            </h2>
          </div>
          <p className="font-lambo text-xs text-steel uppercase tracking-[0.023em]">
            MENAMPILKAN {beritaList.length} BERITA
          </p>
        </div>

        {/* Grid Kartu Berita / State Kosong */}
        {beritaList.length === 0 ? (
          <div className="text-center py-20 bg-marble rounded-lg border border-ash/20">
            <p className="font-lambo text-sm text-steel uppercase tracking-wider">
              BELUM ADA BERITA YANG DITERBITKAN.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {beritaList.map((item) => (
              <BeritaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

