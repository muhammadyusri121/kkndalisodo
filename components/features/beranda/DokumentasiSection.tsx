"use client";

import { useState } from "react";
import Image from "next/image";
import { BannerItem } from "@/types/banner";

interface DokumentasiSectionProps {
  items?: BannerItem[];
}

/**
 * Komponen DokumentasiSection
 * 
 * Menampilkan galeri foto dokumentasi kegiatan desa, potensi alam, dan pengabdian masyarakat.
 * Dilengkapi dengan grid responsif 4 kolom serta modal Lightbox untuk pratinjau foto ukuran penuh.
 *
 * @param {DokumentasiSectionProps} props - Properti komponen berisi daftar item banner foto.
 * @returns {JSX.Element} Elemen seksi galeri foto.
 */
export default function DokumentasiSection({ items = [] }: DokumentasiSectionProps) {
  const [activePhoto, setActivePhoto] = useState<BannerItem | null>(null);

  return (
    <section
      id="dokumentasi"
      aria-labelledby="dokumentasi-heading"
      className="w-full bg-marble bg-pattern text-carbony py-8 sm:py-20 px-4 sm:px-12 lg:px-16 max-w-360 mx-auto border-t border-b border-ash/20"
    >
      {/* Header Seksi: Judul Galeri & Deskripsi */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 border-b border-carbony mb-5 sm:mb-12">
        <div>
          <span className="font-lambo text-xs tracking-[0.15em] text-emerald-dalisodo font-bold uppercase block mb-1">
            GALERI & DOKUMENTASI KEGIATAN
          </span>
          <h2
            id="dokumentasi-heading"
            className="font-lambo text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-carbony"
          >
            DOKUMENTASI FOTO
          </h2>
        </div>
        <p className="font-lambo text-xs sm:text-sm text-steel uppercase tracking-[0.023em] max-w-sm">
          ARSIP FOTO KEGIATAN DESA, POTENSI ALAM, DAN PROGRAM PENGABDIAN MASYARAKAT DALISODO.
        </p>
      </div>

      {/* Grid Foto Responsif (Empty State / 4 Kolom Desktop) */}
      {items.length === 0 ? (
        /* Tampilan Kosong (Empty State) */
        <div
          id="dokumentasi-empty-state"
          className="relative z-10 w-full min-h-60 rounded-2xl bg-white/60 border border-ash/20 flex flex-col items-center justify-center text-center p-8 space-y-3 select-none"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-ash/30 flex items-center justify-center text-emerald-dalisodo shadow-xs">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <path d="M3 15l5-5 4 4 3-3 6 5" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </div>
          <h3 className="font-lambo text-base sm:text-lg font-bold uppercase tracking-[0.023em] text-carbony">
            BELUM ADA DOKUMENTASI FOTO
          </h3>
          <p className="font-lambo text-xs text-steel max-w-sm uppercase tracking-[0.023em]">
            DOKUMENTASI FOTO AKAN DITAMPILKAN DI SINI SETELAH DITAMBAHKAN PADA CONTENTFUL.
          </p>
        </div>
      ) : (
        /* Grid Kartu Foto */
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-carbony border border-ash/30 shadow-xs hover:shadow-xl hover:border-giallo transition-all duration-300 cursor-pointer"
            >
              {/* Gambar Foto */}
              <Image
                src={item.mediaUrl}
                alt={item.judul}
                fill
                unoptimized={true}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Lapisan Gradient Hover & Judul Foto */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="font-lambo text-[10px] text-giallo font-bold tracking-widest uppercase mb-1">
                  DOKUMENTASI
                </span>
                <h3 className="font-lambo text-sm sm:text-base font-bold text-white uppercase tracking-[0.023em] line-clamp-2 leading-snug">
                  {item.judul}
                </h3>
              </div>

              {/* Tombol Perbesar Hover */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10" cy="10" r="6" />
                  <path d="M14 14l5 5M10 7v6M7 10h6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Lightbox (Pratinjau Foto Ukuran Penuh) */}
      {activePhoto && (
        <div
          id="photo-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Foto Penuh"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
          >
            {/* Tombol Tutup Modal */}
            <button
              type="button"
              id="close-lightbox-btn"
              onClick={() => setActivePhoto(null)}
              aria-label="Tutup Tampilan Foto"
              className="absolute -top-12 right-0 font-lambo text-white hover:text-giallo text-sm font-bold tracking-wider flex items-center gap-1.5 uppercase cursor-pointer"
            >
              <span>TUTUP</span>
              <span className="text-lg">✕</span>
            </button>

            {/* Kontainer Gambar Modal */}
            <div className="relative w-full aspect-16/10 sm:aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <Image
                src={activePhoto.mediaUrl}
                alt={activePhoto.judul}
                fill
                unoptimized={true}
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Keterangan / Judul Foto Modal */}
            <div className="mt-4 text-center">
              <h4 className="font-lambo text-base sm:text-xl font-bold text-white uppercase tracking-[0.023em]">
                {activePhoto.judul}
              </h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
