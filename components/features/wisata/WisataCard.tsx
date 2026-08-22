import Link from "next/link";
import Image from "next/image";
import { WisataItem } from "@/types/wisata";

/**
 * Helper: Ekstrak teks ringkasan singkat dari objek RichText Contentful.
 *
 * @param {any} richText - Objek atau string RichText.
 * @returns {string} Teks ringkasan tanpa tag HTML.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getShortDescription = (richText: any): string => {
  if (!richText) return "";
  if (typeof richText === "string") return richText;
  if (!richText.content) return "";
  
  let text = "";
  for (const node of richText.content) {
    if (node.nodeType === "paragraph" && node.content) {
      for (const child of node.content) {
        if (child.nodeType === "text" && child.value) {
          text += child.value + " ";
        }
      }
    }
    if (text.length > 140) break;
  }
  return text.trim();
};

/**
 * Komponen WisataCard
 * 
 * Menampilkan kartu destinasi wisata Desa Dalisodo.
 * Mencakup foto thumbnail, lencana kategori wisata, judul, deskripsi ringkas, serta tombol jelajahi destinasi.
 *
 * @param {Object} props - Properti komponen.
 * @param {WisataItem} props.item - Objek data destinasi wisata.
 * @returns {JSX.Element} Elemen kartu wisata.
 */
export default function WisataCard({ item }: { item: WisataItem }) {
  const shortDesc = getShortDescription(item.deskripsi);
  const targetLink = `/wisata/${item.slug || item.id}`;

  return (
    <article
      id={`wisata-card-${item.id}`}
      className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-emerald-dalisodo/40 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      {/* Gambar Thumbnail Wisata & Lencana Kategori */}
      <Link
        href={targetLink}
        aria-label={`Jelajahi wisata: ${item.judul}`}
        className="block relative aspect-video w-full overflow-hidden bg-carbon-deep"
      >
        <Image
          src={item.thumbnailUrl}
          alt={item.judul}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Lencana Kategori Wisata */}
        {(() => {
          const displayKategori = item.kategori?.filter(
            (kat) => kat.toLowerCase().trim() !== "wisata alam"
          );
          if (!displayKategori || displayKategori.length === 0) return null;
          return (
            <span className="absolute top-3 left-3 bg-carbon-deep/80 backdrop-blur-md text-giallo font-sans text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border border-white/10 shadow-sm">
              {displayKategori.join(" • ")}
            </span>
          );
        })()}
      </Link>

      {/* Detail Konten Wisata */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between bg-white space-y-4">
        <div className="space-y-2.5">
          {/* Judul Destinasi */}
          <h3 className="font-sans text-base sm:text-lg font-bold text-carbony group-hover:text-emerald-dalisodo transition-colors leading-snug line-clamp-2">
            <Link href={targetLink}>{item.judul}</Link>
          </h3>

          {/* Cuplikan Deskripsi */}
          <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-normal">
            {shortDesc || "Destinasi wisata favorit di lereng Gunung Kawi Desa Dalisodo."}
          </p>
        </div>

        {/* Tautan Jelajahi Destinasi */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={targetLink}
            className="font-sans text-xs font-semibold text-emerald-dalisodo group-hover:text-emerald-dark inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Jelajahi Destinasi</span>
            <span className="text-giallo font-bold transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

