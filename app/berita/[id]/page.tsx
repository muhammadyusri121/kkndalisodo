import { getBeritaById, getOtherBeritaList, formatTanggalWaktu } from "@/server/services/beritaService";
import RichContentRenderer from "@/components/features/berita/RichContentRenderer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateNewsArticleSchema,
} from "@/lib/seo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Menghasilkan metadata SEO dinamis untuk halaman detail berita.
 *
 * @param {PageProps} props - Parameter rute berisi ID berita.
 * @returns {Promise<Metadata>} Objek metadata judul, deskripsi, OpenGraph, dan Twitter Card.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getBeritaById(id);
  if (!item) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman berita atau dokumentasi kegiatan yang dicari tidak ditemukan di portal Desa Dalisodo.",
    };
  }

  const pageUrl = `${SITE_URL}/berita/${id}`;
  const coverImage = item.coverUrl || `${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`;

  return {
    title: item.judul,
    description: item.ringkasan || `Baca selengkapnya mengenai ${item.judul} di portal resmi Desa Dalisodo, Wagir, Malang.`,
    keywords: [
      item.judul,
      "Berita Desa Dalisodo",
      "Kegiatan Desa Dalisodo",
      "Dalisodo Wagir Malang",
      item.kategori || "Berita & Kegiatan",
      "KKN 10 Dalisodo",
    ],
    alternates: {
      canonical: `/berita/${id}`,
    },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url: pageUrl,
      siteName: SITE_NAME,
      title: item.judul,
      description: item.ringkasan,
      publishedTime: item.tanggalwaktu,
      authors: [item.penulis || "Pemerintah Desa Dalisodo & Tim KKN 10"],
      section: item.kategori || "Berita & Kegiatan",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: item.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.judul,
      description: item.ringkasan,
      images: [coverImage],
    },
  };
}

/**
 * Halaman Detail Berita & Kegiatan Desa Dalisodo.
 * Rute server async yang mengambil data berita berdasarkan ID dan rekomendasi berita terkait.
 *
 * @param {PageProps} props - Parameter rute berisi ID berita.
 * @returns {Promise<JSX.Element>} Elemen halaman detail berita.
 */
export default async function DetailBeritaPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getBeritaById(id);

  if (!item) {
    notFound();
  }

  const formattedDate = formatTanggalWaktu(item.tanggalwaktu);
  const otherBerita = await getOtherBeritaList(item.id, 4);

  return (
    <main id={`berita-detail-${item.id}`} className="w-full bg-marble min-h-screen pb-20">
      {/* Schema Structured Data: NewsArticle & BreadcrumbList untuk Google */}
      <JsonLd
        data={[
          generateBreadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Berita", url: "/berita" },
            { name: item.judul, url: `/berita/${item.id}` },
          ]),
          generateNewsArticleSchema({
            title: item.judul,
            description: item.ringkasan,
            url: `/berita/${item.id}`,
            imageUrl: item.coverUrl,
            publishedAt: item.tanggalwaktu,
            authorName: item.penulis || "Pemerintah Desa Dalisodo & Tim KKN 10",
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
            href="/berita"
            className="font-lambo text-xs sm:text-sm tracking-[0.15em] text-giallo uppercase font-bold inline-flex items-center gap-2 group hover:text-white transition-colors duration-300 w-fit"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300" aria-hidden="true">&larr;</span>
            <span>KEMBALI KE BERITA</span>
          </Link>

          {/* Lencana Kategori Berita */}
          {item.kategori && (
            <div className="pt-1.5">
              <span className="bg-emerald-dalisodo/20 backdrop-blur-sm text-giallo font-lambo text-xs font-bold uppercase tracking-[0.12em] px-3.5 py-1.5 rounded-md border border-giallo/30 shadow-[0_0_15px_rgba(255,192,0,0.05)] cursor-default">
                {item.kategori}
              </span>
            </div>
          )}

          {/* Judul Utama Artikel Berita */}
          <h1 className="font-lambo text-xl sm:text-2xl md:text-3xl lg:text-3.5xl xl:text-4xl font-bold uppercase tracking-[0.02em] text-white leading-tight w-full max-w-none drop-shadow-md">
            {item.judul}
          </h1>

          {/* Tanggal Rilis & Penulis Berita */}
          <div className="flex flex-wrap items-center gap-3 pt-1.5 font-lambo text-xs sm:text-sm text-slate-300 uppercase tracking-wider">
            <time dateTime={item.tanggalwaktu} className="text-emerald-dalisodo font-bold">
              {formattedDate || item.tanggalwaktu}
            </time>
            {item.penulis && (
              <>
                <span className="text-anvil" aria-hidden="true">•</span>
                <span className="text-slate-400">OLEH: {item.penulis.toUpperCase()}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Kontainer Isi Artikel Berita */}
      <div className="max-w-7xl mx-auto pt-8 sm:pt-12 px-6 sm:px-12 lg:px-16 space-y-12 sm:space-y-16">
        
        {/* Gambar Sampul Berita */}
        {item.coverUrl && (
          <div className="relative w-full aspect-21/9 max-h-125 rounded-xl overflow-hidden bg-carbony border border-ash/20 shadow-md">
            <Image
              src={item.coverUrl}
              alt={item.cover?.title || item.judul}
              fill
              priority
              sizes="(max-width: 1300px) 100vw, 1240px"
              className="object-cover object-center filter brightness-[0.95]"
            />
          </div>
        )}

        {/* Kartu Konten Utama Artikel */}
        <article className="bg-white rounded-xl border border-ash/20 p-6 sm:p-10 lg:p-14 shadow-sm space-y-8">
          <div className="prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-lambo prose-headings:uppercase prose-headings:text-carbony prose-a:text-emerald-dalisodo prose-p:text-slate-700 prose-p:leading-relaxed font-sans text-base sm:text-lg text-anvil leading-relaxed space-y-4">
            <RichContentRenderer content={item.isi} />
          </div>

          {/* Catatan Kaki Artikel */}
          <div className="pt-6 border-t border-marble">
            <div className="font-lambo text-xs text-steel uppercase tracking-wider">
              DITERBITKAN OLEH PEMERINTAH DESA DALISODO & TIM KKN 10
            </div>
          </div>
        </article>

        {/* Seksi Rekomendasi Berita Lainnya */}
        <section id="berita-rekomendasi" aria-label="Berita Lainnya" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-carbony">
            <div>
              <h2 className="font-lambo text-2xl sm:text-3xl font-bold uppercase tracking-[0.023em] text-carbony">
                BERITA LAINNYA
              </h2>
            </div>
          </div>

          {otherBerita.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-ash/20">
              <p className="font-lambo text-xs sm:text-sm text-steel uppercase tracking-wider">
                TIDAK ADA BERITA LAINNYA.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {otherBerita.map((otherItem) => (
                <Link
                  key={otherItem.id}
                  href={`/berita/${otherItem.id}`}
                  className="group flex items-center gap-3.5 sm:gap-4 bg-white p-3 sm:p-3.5 rounded-xl border border-ash/20 hover:border-giallo hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-24 h-18 sm:w-28 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-carbony">
                    <Image
                      src={otherItem.coverUrl}
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

