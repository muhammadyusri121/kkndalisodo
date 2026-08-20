import HeroSection from "@/components/features/beranda/HeroSection";
import WisataCard from "@/components/features/wisata/WisataCard";
import BeritaCard from "@/components/features/berita/BeritaCard";
import VideoSection from "@/components/features/beranda/VideoSection";
import DokumentasiSection from "@/components/features/beranda/DokumentasiSection";
import { getWisataList } from "@/server/services/wisataService";
import { getBeritaList } from "@/server/services/beritaService";
import { getHeroSlides } from "@/server/services/heroService";
import { getVideoList } from "@/server/services/videoService";
import { getBannerList } from "@/server/services/bannerService";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DEFAULT_DESCRIPTION,
  TARGET_KEYWORDS,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

// Meta data SEO Halaman Beranda
export const metadata: Metadata = {
  title: "Website Resmi & Portal Wisata Desa Dalisodo Wagir Malang",
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: TARGET_KEYWORDS,
  alternates: {
    canonical: "/",
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
        alt: "Portal Resmi Desa Dalisodo - Wagir, Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    images: ["/assets/image/Logo_Kabupaten_Malang.svg"],
  },
};

/**
 * Halaman Utama (HomePage / Beranda)
 * 
 * Halaman utama portal web Desa Dalisodo yang menyajikan data secara dinamis dari Contentful.
 * Mengambil data secara paralel (`Promise.all`) untuk slide hero, berita terbaru, wisata unggulan,
 * video profil, serta galeri foto dokumentasi.
 *
 * @returns {Promise<JSX.Element>} Halaman beranda portal web.
 */
export default async function HomePage() {
  const [heroSlides, wisataList, beritaList, videoList, bannerList] = await Promise.all([
    getHeroSlides(),
    getWisataList(),
    getBeritaList(),
    getVideoList(),
    getBannerList(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-16 pb-6 sm:pb-12">
      {/* Schema Breadcrumb untuk Google Search */}
      <JsonLd data={generateBreadcrumbSchema([{ name: "Beranda", url: "/" }])} />
      {/* Seksi 1: Banner Slider Utama (Hero Section) */}
      <HeroSection initialSlides={heroSlides} />

      {/* Seksi 2: Berita Terkini (Grid 4 Kolom Artikel Terbaru) */}
      <section
        id="berita-terkini-section"
        aria-labelledby="berita-heading"
        className="w-full bg-[#ffffff] text-carbony py-8 sm:py-20 px-4 sm:px-12 lg:px-16 max-w-360 mx-auto border-b border-marble"
      >
        {/* Header Seksi Berita */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-carbony">
          <div>
            <span className="font-lambo text-xs tracking-[0.15em] text-emerald-dalisodo font-bold uppercase block mb-1">
              KABAR & DOKUMENTASI KEGIATAN
            </span>
            <h2
              id="berita-heading"
              className="font-lambo text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-carbony"
            >
              BERITA TERKINI
            </h2>
          </div>
          <Link
            id="berita-view-all-link"
            href="/berita"
            className="font-lambo text-xs sm:text-sm font-bold uppercase tracking-[0.023em] text-carbony hover:text-emerald-dalisodo hover:-translate-y-0.5 inline-flex items-center gap-2 border-b-2 border-giallo pb-1 transition-all duration-300 self-start sm:self-end group"
          >
            <span className="group-hover:text-emerald-dalisodo transition-colors">LIHAT SEMUA BERITA</span>
            <span className="text-giallo font-bold transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Grid Kartu Berita (Maksimal 4 Item Terbaru) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 pt-5 sm:pt-10">
          {beritaList.slice(0, 4).map((item) => (
            <BeritaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Seksi 3: Wisata Dalisodo (Grid 4 Kolom Destinasi Populer) */}
      <section
        id="wisata-dalisodo-section"
        aria-labelledby="wisata-heading"
        className="w-full bg-marble bg-pattern text-carbony py-8 sm:py-20 px-4 sm:px-12 lg:px-16 max-w-360 mx-auto border-t border-b border-ash/20"
      >
        {/* Header Seksi Wisata */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-carbony">
          <div>
            <span className="font-lambo text-xs tracking-[0.15em] text-emerald-dalisodo font-bold uppercase block mb-1">
              DESTINASI & POTENSI LERENG KAWI
            </span>
            <h2
              id="wisata-heading"
              className="font-lambo text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-carbony"
            >
              WISATA DALISODO
            </h2>
          </div>
          <Link
            id="wisata-view-all-link"
            href="/wisata"
            className="font-lambo text-xs sm:text-sm font-bold uppercase tracking-[0.023em] text-carbony hover:text-emerald-dalisodo hover:-translate-y-0.5 inline-flex items-center gap-2 border-b-2 border-giallo pb-1 transition-all duration-300 self-start sm:self-end group"
          >
            <span className="group-hover:text-emerald-dalisodo transition-colors">JELAJAHI SEMUA WISATA</span>
            <span className="text-giallo font-bold transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Grid Kartu Wisata (Maksimal 4 Item Unggulan) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 pt-5 sm:pt-10">
          {wisataList.slice(0, 4).map((item) => (
            <WisataCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Seksi 4: Video Profil Desa Dalisodo */}
      <VideoSection videos={videoList} />

      {/* Seksi 5: Dokumentasi Foto Kegiatan */}
      <DokumentasiSection items={bannerList} />
    </div>
  );
}


