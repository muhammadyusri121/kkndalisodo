import Link from "next/link";
import Image from "next/image";
import { BeritaItem } from "@/types/berita";
import { formatTanggalWaktu } from "@/server/services/beritaService";

/**
 * Komponen BeritaCard
 * 
 * Menampilkan kartu ringkasan berita kegiatan Desa Dalisodo.
 * Mencakup gambar sampul, lencana kategori, tanggal publikasi yang diformat, judul, ringkasan, serta tautan ke halaman detail berita.
 *
 * @param {Object} props - Properti komponen.
 * @param {BeritaItem} props.item - Objek data berita.
 * @returns {JSX.Element} Elemen kartu berita.
 */
export default function BeritaCard({ item }: { item: BeritaItem }) {
  const formattedDate = item.tanggalwaktu
    ? formatTanggalWaktu(item.tanggalwaktu)
    : "Kabar Desa";

  return (
    <article
      id={`berita-card-${item.id}`}
      className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-emerald-dalisodo/40 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      {/* Visual Sampul Berita & Lencana Kategori */}
      <Link
        href={`/berita/${item.id}`}
        aria-label={`Baca berita: ${item.judul}`}
        className="block relative aspect-video w-full overflow-hidden bg-carbon-deep"
      >
        <Image
          src={item.coverUrl}
          alt={item.judul}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {item.kategori && (
          <span className="absolute top-3 left-3 bg-carbon-deep/80 backdrop-blur-md text-giallo font-sans text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border border-white/10 shadow-sm">
            {item.kategori}
          </span>
        )}
      </Link>

      {/* Rincian Konten Berita */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between bg-white space-y-4">
        <div className="space-y-2.5">
          {/* Stempel Tanggal Publikasi */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-sans">
            <svg
              className="w-3.5 h-3.5 text-emerald-dalisodo shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <time dateTime={item.tanggalwaktu} className="font-medium text-slate-500">
              {formattedDate}
            </time>
          </div>

          {/* Judul Berita */}
          <h3 className="font-sans font-bold text-base sm:text-lg text-carbony group-hover:text-emerald-dalisodo transition-colors leading-snug line-clamp-2">
            <Link href={`/berita/${item.id}`}>
              {item.judul}
            </Link>
          </h3>

          {/* Ringkasan Isi Berita */}
          <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-normal">
            {item.ringkasan}
          </p>
        </div>

        {/* Tautan Baca Selengkapnya */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/berita/${item.id}`}
            className="font-sans text-xs font-semibold text-emerald-dalisodo group-hover:text-emerald-dark inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Baca Selengkapnya</span>
            <span className="text-giallo font-bold transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

