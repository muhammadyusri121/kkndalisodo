
import { getWisataBySlug, getOtherWisataList } from "@/server/services/wisataService";
import { notFound } from "next/navigation";
import RichContentRenderer from "@/components/features/berita/RichContentRenderer";
import Link from "next/link";
import Image from "next/image";
import ImageSlider from "@/components/features/wisata/ImageSlider";

import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateTouristAttractionSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Menghasilkan metadata SEO dinamis untuk halaman detail destinasi wisata.
 *
 * @param {Props} props - Parameter rute berisi slug wisata.
 * @returns {Promise<Metadata>} Objek metadata judul, deskripsi, OpenGraph, dan Twitter Card.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wisata = await getWisataBySlug(slug);
  if (!wisata) {
    return {
      title: "Wisata Tidak Ditemukan",
      description: "Halaman destinasi wisata yang dicari tidak ditemukan di portal Desa Dalisodo.",
    };
  }

  const pageUrl = `${SITE_URL}/wisata/${wisata.slug || slug}`;
  const metaImage = wisata.thumbnailUrl || `${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`;

  return {
    title: `${wisata.judul} | Wisata Alam Desa Dalisodo`,
    description: `Jelajahi keindahan dan informasi lengkap destinasi wisata ${wisata.judul} di lereng Gunung Kawi, Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang.`,
    keywords: [
      wisata.judul,
      "Wisata Desa Dalisodo",
      "Wisata Alam Wagir Malang",
      "Destinasi Lereng Gunung Kawi",
      "Wisata Dalisodo Malang",
      ...(wisata.kategori || ["Wisata Alam"]),
    ],
    alternates: {
      canonical: `/wisata/${wisata.slug || slug}`,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: pageUrl,
      siteName: SITE_NAME,
      title: `${wisata.judul} | Wisata Alam Desa Dalisodo`,
      description: `Informasi dan keindahan ${wisata.judul} di lereng Gunung Kawi, Desa Dalisodo, Wagir, Malang.`,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: wisata.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${wisata.judul} | Wisata Alam Desa Dalisodo`,
      description: `Informasi dan keindahan ${wisata.judul} di lereng Gunung Kawi, Desa Dalisodo, Wagir, Malang.`,
      images: [metaImage],
    },
  };
}

/**
 * Halaman Detail Destinasi Wisata Desa Dalisodo.
 * Rute server async yang mengambil data destinasi wisata berdasarkan slug/ID dan wisata rekomendasi lainnya.
 *
 * @param {Props} props - Parameter rute berisi slug wisata.
 * @returns {Promise<JSX.Element>} Elemen halaman detail wisata.
 */
export default async function WisataDetailPage({ params }: Props) {
  const { slug } = await params;
  const wisata = await getWisataBySlug(slug);

  if (!wisata) {
    notFound();
  }

  // Gunakan galeri untuk slider, jika tidak ada baru fallback ke thumbnail
  const sliderImages =
    wisata.galeriUrls && wisata.galeriUrls.length > 0
      ? wisata.galeriUrls
      : [wisata.thumbnailUrl];

  const otherWisata = await getOtherWisataList(wisata.slug || wisata.id, 4);

  return (
    <main id={`wisata-detail-${wisata.id}`} className="w-full bg-marble min-h-screen pb-20">
      {/* Schema Structured Data: TouristAttraction & BreadcrumbList untuk Google Search */}
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Wisata Desa", url: "/wisata" },
            { name: wisata.judul, url: `/wisata/${wisata.slug || wisata.id}` },
          ]),
          generateTouristAttractionSchema({
            title: wisata.judul,
            url: `/wisata/${wisata.slug || wisata.id}`,
            imageUrl: wisata.thumbnailUrl,
            category: wisata.kategori,
          }),
        ]}
      />
      {/* Header Banner Utama (Dark Stage) */}
      <header className="w-full bg-carbon-deep text-white pt-24 sm:pt-32 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-16 border-b border-anvil relative overflow-hidden">
        {/* Ornamen Pencahayaan Latar Belakang */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-dalisodo/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-giallo/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto space-y-3.5 relative z-10">
          {/* Tombol Navigasi Kembali */}
          <Link
            href="/wisata"
            className="font-lambo text-xs sm:text-sm tracking-[0.15em] text-giallo uppercase font-bold inline-flex items-center gap-2 group hover:text-white transition-colors duration-300 w-fit"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300" aria-hidden="true">&larr;</span>
            <span>KEMBALI KE DAFTAR WISATA</span>
          </Link>

          {/* Lencana Kategori Wisata */}
          {wisata.kategori && wisata.kategori.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1.5">
              {wisata.kategori.map((kat, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-dalisodo/20 backdrop-blur-sm text-giallo font-lambo text-xs font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-md border border-giallo/30 shadow-[0_0_15px_rgba(255,192,0,0.05)] cursor-default"
                >
                  {kat}
                </span>
              ))}
            </div>
          )}

          {/* Judul Utama Destinasi Wisata */}
          <h1 className="font-lambo text-xl sm:text-2xl md:text-3xl lg:text-3.5xl xl:text-4xl font-bold uppercase tracking-[0.02em] text-white leading-tight w-full max-w-none drop-shadow-md">
            {wisata.judul}
          </h1>
        </div>
      </header>

      {/* Area Konten Utama */}
      <div className="max-w-7xl mx-auto pt-8 sm:pt-12 px-6 sm:px-12 lg:px-16 space-y-12 sm:space-y-16">
        
        {/* Slider Galeri Foto */}
        <div className="w-full shadow-lg rounded-xl overflow-hidden">
          <ImageSlider images={sliderImages} judul={wisata.judul} />
        </div>

        {/* Kartu Informasi & Narasi Deskripsi Wisata */}
        <article className="bg-white rounded-xl border border-ash/20 p-6 sm:p-10 lg:p-14 shadow-sm space-y-8">
          
          {/* Narasi Deskripsi */}
          <div className="space-y-4">
            <h2 className="font-lambo text-xl sm:text-2xl font-bold uppercase text-carbony tracking-[0.023em] flex items-center gap-2">
              <span>TENTANG DESTINASI</span>
            </h2>
            <div className="prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-lambo prose-headings:uppercase prose-a:text-emerald-dalisodo font-sans text-base sm:text-lg text-slate-700 leading-relaxed space-y-4">
              <RichContentRenderer content={wisata.deskripsi} />
            </div>
          </div>

          {/* Rincian Detail Informasi (Tabel/RichText) */}
          {wisata.detailInformasi && (
            <div className="pt-6 border-t border-slate-200/80 space-y-3">
              <h2 className="font-lambo text-xl sm:text-2xl font-bold uppercase text-carbony tracking-[0.023em] flex items-center gap-2">
                <span>INFORMASI & KETERANGAN DESTINASI</span>
              </h2>
              <div>
                <RichContentRenderer content={wisata.detailInformasi} />
              </div>
            </div>
          )}

          {/* Spanduk CTA Kontak Balai Desa */}
          <div className="bg-carbon-deep text-white p-6 sm:p-8 rounded-xl border border-anvil flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
            <div>
              <h3 className="font-lambo text-xl font-bold uppercase text-giallo tracking-[0.023em]">
                INGIN BERKUNJUNG KE {wisata.judul.toUpperCase()}?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-300 mt-1">
                Hubungi Balai Desa atau pemandu lokasi untuk petunjuk arah dan informasi selengkapnya.
              </p>
            </div>
            <Link
              href="/#kontak"
              className="font-lambo bg-giallo text-black hover:bg-emerald-dalisodo hover:text-white px-6 py-3 rounded-lg text-xs sm:text-sm font-bold tracking-[0.023em] uppercase transition-colors shrink-0 shadow-md"
            >
              HUBUNGI BALAI DESA
            </Link>
          </div>

        </article>

        {/* Seksi Destinasi Wisata Rekomendasi Lainnya */}
        <section id="wisata-rekomendasi" aria-label="Destinasi Wisata Lainnya" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-carbony">
            <div>
              <h2 className="font-lambo text-2xl sm:text-3xl font-bold uppercase tracking-[0.023em] text-carbony">
                DESTINASI WISATA LAINNYA
              </h2>
            </div>
          </div>

          {otherWisata.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-ash/20">
              <p className="font-lambo text-xs sm:text-sm text-steel uppercase tracking-wider">
                TIDAK ADA DESTINASI WISATA LAINNYA.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {otherWisata.map((otherItem) => (
                <Link
                  key={otherItem.id}
                  href={`/wisata/${otherItem.slug || otherItem.id}`}
                  className="group flex items-center gap-3.5 sm:gap-4 bg-white p-3 sm:p-3.5 rounded-xl border border-ash/20 hover:border-giallo hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-24 h-18 sm:w-28 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-carbony">
                    <Image
                      src={otherItem.thumbnailUrl}
                      alt={otherItem.judul}
                      fill
                      sizes="120px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <h3 className="font-lambo text-xs sm:text-sm font-bold uppercase text-carbony group-hover:text-emerald-dalisodo transition-colors leading-snug line-clamp-2">
                      {otherItem.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
