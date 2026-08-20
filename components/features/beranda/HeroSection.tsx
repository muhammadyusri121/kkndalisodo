"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroSlideItem } from "@/types/hero";

interface HeroSectionProps {
  initialSlides?: HeroSlideItem[];
}

const KATEGORI_CONFIG = {
  Dokumentasi: {
    label: "DOKUMENTASI FOTO",
    ctaText: "LIHAT DOKUMENTASI",
    color: "bg-giallo",
  },
  Berita: {
    label: "BERITA TERKINI",
    ctaText: "LIHAT SEMUA BERITA",
    color: "bg-emerald-dalisodo",
  },
  Wisata: {
    label: "DESTINASI WISATA",
    ctaText: "JELAJAHI WISATA",
    color: "bg-giallo",
  },
} as const;

/**
 * Komponen HeroSection
 * 
 * Menampilkan slider utama (hero banner) di halaman beranda Desa Dalisodo.
 * Mendukung rotasi otomatis slide, navigasi tombol panah, indikator progress,
 * gestur usap layar sentuh (swipe touch), serta state kosong (empty state).
 *
 * @param {HeroSectionProps} props - Properti komponen berisi daftar slide hero awal.
 * @returns {JSX.Element} Elemen seksi hero slider.
 */
export default function HeroSection({ initialSlides }: HeroSectionProps) {
  const slides = initialSlides && initialSlides.length > 0 ? initialSlides : [];

  // ── State & Ref Interaksi Slider ──────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Navigasi Slide ─────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentIndex((prev) => {
        const total = slides.length;
        if (total === 0) return prev;
        return ((index % total) + total) % total;
      });
    },
    [slides.length]
  );

  const nextSlide = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prevSlide = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // ── Timer Rotasi Otomatis (5 Detik) ──────────────────────────────────────────
  useEffect(() => {
    if (slides.length === 0 || isHovered) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, currentIndex, nextSlide, slides.length]);

  // ── Handler Gestur Sentuh (Touch Swipe) ──────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };
  const handleTouchEnd = () => {
    if (touchStartX && touchEndX && touchStartY && touchEndY) {
      const dx = touchStartX - touchEndX;
      const dy = touchStartY - touchEndY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) nextSlide();
        else prevSlide();
      }
    }
    setTouchStartX(null); setTouchEndX(null);
    setTouchStartY(null); setTouchEndY(null);
    setTimeout(() => setIsHovered(false), 2000);
  };

  // ── Tampilan Kosong (Empty State) ───────────────────────────────────────────
  if (slides.length === 0) {
    return (
      <section
        id="hero-empty-state"
        aria-label="Halaman Depan Tidak Tersedia"
        className="relative w-full h-[55vh] min-h-105 bg-carbon-deep text-white flex items-center justify-center border-b border-anvil overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-linear-to-b from-carbon-deep via-carbony to-black opacity-90 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-giallo/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <svg className="w-8 h-8 text-giallo" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 15c1.5-2 5-2 6.5 0M9 10h.01M15 10h.01" />
            </svg>
          </div>
          <h2 className="font-lambo text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
            Halaman Depan Tidak Ditemukan
          </h2>
          <p className="font-lambo text-xs sm:text-sm text-steel tracking-[0.023em] max-w-xs leading-relaxed">
            BELUM ADA DATA BERITA ATAU WISATA YANG TERSEDIA.
          </p>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];
  const config = KATEGORI_CONFIG[currentSlide.kategori] ?? KATEGORI_CONFIG.Berita;

  return (
    <section
      id="hero-slider"
      aria-label="Hero Slider Desa Dalisodo"
      className="relative w-full h-[60vh] min-h-105 sm:h-screen sm:min-h-screen bg-carbony text-white overflow-hidden select-none border-b border-anvil touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gambar latar belakang slide */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Lapisan overlay gelap sinematik */}
            <div className="absolute inset-0 bg-linear-to-r from-carbon-deep/70 via-carbon-deep/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-carbon-deep/75 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Gambar Mini (Thumbnail) */}
            {slide.thumbnailUrl ? (
              <Image
                src={slide.thumbnailUrl}
                alt={slide.judul}
                fill
                priority={idx === 0}
                unoptimized={true}
                className="object-cover object-center"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-carbon-deep via-carbony to-black" />
            )}
          </div>
        );
      })}

      {/* Konten Teks Overlay & Tombol Aksi (CTA) */}
      <div className="relative z-20 h-full max-w-360 mx-auto px-4 sm:px-12 lg:px-16 flex flex-col justify-end pb-12 sm:pb-28 lg:pb-32">
        <article className="max-w-lg space-y-2 sm:space-y-3">
          {/* Judul Slide */}
          <h1
            id="hero-headline"
            className="font-lambo text-base sm:text-2xl md:text-3xl leading-snug sm:leading-tight tracking-[0.023em] text-white uppercase font-bold line-clamp-3"
          >
            {currentSlide.judul}
          </h1>

          {/* Tombol Panggilan Aksi (CTA) */}
          <div className="pt-1">
            <Link
              id="hero-primary-cta-link"
              href={currentSlide.ctaLink}
              className="font-lambo bg-giallo text-pure-black px-4 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-sm font-bold tracking-[0.023em] hover:bg-giallo-dark hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 uppercase inline-flex items-center gap-2 group rounded-lg"
            >
              <span>{config.ctaText}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </article>
      </div>

      {/* Batang Indikator Kemajuan (Progress Bar) */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-0.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="flex-1 h-1 cursor-pointer group"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-giallo" : "bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Tombol Navigasi Panah (Kiri & Kanan) */}
      {slides.length > 1 && (
        <>
          <button
            id="hero-prev-slide-btn"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            aria-label="Slide Sebelumnya"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-transparent text-white/80 hover:text-giallo drop-shadow-lg transition-all duration-200 group flex items-center justify-center cursor-pointer hover:scale-115"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            id="hero-next-slide-btn"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            aria-label="Slide Selanjutnya"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-transparent text-white/80 hover:text-giallo drop-shadow-lg transition-all duration-200 group flex items-center justify-center cursor-pointer hover:scale-115"
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

    </section>
  );
}
