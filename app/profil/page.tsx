import ProfilSection from "@/components/features/profil/ProfilSection";
import { getProfilDesa } from "@/server/services/profilService";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

// Meta data halaman Profil Desa (SEO Google & Media Sosial)
export const metadata: Metadata = {
  title: "Profil Lengkap Desa Dalisodo | Kecamatan Wagir, Kabupaten Malang",
  description:
    "Profil resmi Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang. Informasi lengkap letak geografis lereng timur Gunung Kawi (±715 mdpl), semboyan Madep Manteb Manetep, wilayah dusun, demografi, struktur pemerintahan desa, sarana prasarana, dan potensi ekonomi.",
  keywords: [
    "Profil Desa Dalisodo",
    "Pemerintah Desa Dalisodo",
    "Sejarah Desa Dalisodo",
    "Dusun di Desa Dalisodo",
    "Kecamatan Wagir Kabupaten Malang",
    "Demografi Penduduk Dalisodo",
    "Geografi Lereng Gunung Kawi",
    "Batas Wilayah Dalisodo",
    "Struktur Organisasi Desa Dalisodo",
    "Madep Manteb Manetep",
  ],
  alternates: {
    canonical: "/profil",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: `${SITE_URL}/profil`,
    siteName: SITE_NAME,
    title: "Profil Lengkap Desa Dalisodo | Kecamatan Wagir, Kabupaten Malang",
    description:
      "Profil resmi Desa Dalisodo: Geografi lereng Gunung Kawi, wilayah dusun, demografi, tata kelola pemerintahan, dan potensi ekonomi desa.",
    images: [
      {
        url: "/assets/image/Logo_Kabupaten_Malang.svg",
        width: 800,
        height: 600,
        alt: "Profil Resmi Desa Dalisodo - Wagir, Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profil Lengkap Desa Dalisodo | Kecamatan Wagir, Kabupaten Malang",
    description:
      "Profil resmi Desa Dalisodo, Wagir, Malang: Geografi lereng Gunung Kawi, data dusun, demografi, dan potensi ekonomi.",
    images: ["/assets/image/Logo_Kabupaten_Malang.svg"],
  },
};

/**
 * Halaman Profil Desa (ProfilPage)
 * 
 * Menampilkan halaman profil lengkap Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang.
 * Mengambil data profil desa secara asinkron dari server service data.
 *
 * @returns {Promise<JSX.Element>} Halaman profil desa.
 */
export default async function ProfilPage() {
  const data = await getProfilDesa();

  // Schema Tempat & Wilayah Administratif untuk Profil Desa
  const profilPlaceSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Desa Dalisodo",
    alternateName: ["Dalisodo Wagir", "Desa Wisata Dalisodo"],
    description: data.deskripsi,
    url: `${SITE_URL}/profil`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.0125587,
      longitude: 112.519391,
      elevation: "715",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Dalisodo",
      addressLocality: "Kecamatan Wagir",
      addressRegion: "Kabupaten Malang, Jawa Timur",
      postalCode: "65158",
      addressCountry: "ID",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Kecamatan Wagir, Kabupaten Malang",
    },
  };

  return (
    <main id="profil-main-page" className="w-full bg-marble min-h-screen">
      {/* Schema Breadcrumb & Schema Place untuk Googlebot */}
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Profil Desa", url: "/profil" },
          ]),
          profilPlaceSchema,
        ]}
      />

      {/* Banner Header Halaman (Dark Hero Stage) */}
      <header
        id="profil-header-banner"
        className="w-full bg-carbon-deep text-white pt-28 sm:pt-36 pb-16 sm:pb-20 px-6 sm:px-12 lg:px-16 border-b border-anvil relative overflow-hidden"
      >
        <div className="max-w-360 mx-auto space-y-6 relative z-10">
          {/* Navigasi Jejak Halaman (Breadcrumb) */}
          <nav
            aria-label="Breadcrumb"
            className="font-lambo text-xs tracking-[0.15em] text-giallo uppercase font-bold flex items-center gap-2"
          >
            <Link href="/" className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 inline-block">
              BERANDA
            </Link>
            <span>/</span>
            <span className="text-slate-400">PROFIL DESA</span>
          </nav>

          {/* Judul & Subtitle Halaman */}
          <div className="space-y-3">
            <span className="inline-block bg-giallo text-black font-lambo text-xs sm:text-sm font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-lg">
              KECAMATAN WAGIR • KABUPATEN MALANG
            </span>
            <h1 className="font-lambo text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.023em] text-white leading-tight w-full max-w-none">
              PROFIL DESA DALISODO
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 w-full max-w-none leading-relaxed">
              Mengenal gambaran geografis lereng Gunung Kawi, semboyan <strong className="text-giallo">&quot;{data.semboyan}&quot;</strong>, {data.jumlahDusunCount} wilayah dusun, data demografi kependudukan, dan potensi ekonomi desa.
            </p>
          </div>
        </div>
      </header>

      {/* Komponen Utama Profil Desa (Dengan Navigasi Sticky Sub-Seksi) */}
      <ProfilSection data={data} />
    </main>
  );
}



