"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  judul: string;
}

/**
 * Komponen ImageSlider
 * 
 * Menampilkan slider galeri foto destinasi wisata dengan mekanisme perulangan tak terbatas (infinite loop).
 * Mendukung navigasi tombol panah kiri/kanan, transisi halus, serta lencana penghitung foto aktif.
 *
 * @param {ImageSliderProps} props - Properti berisi larik URL gambar dan judul destinasi.
 * @returns {JSX.Element | null} Elemen slider foto wisata.
 */
export default function ImageSlider({ images, judul }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!images || images.length === 0) return null;

  // Jika hanya ada 1 gambar, tampilkan gambar dengan potongan tipis tepi 2-3%
  if (images.length === 1) {
    return (
      <div className="w-full relative overflow-hidden rounded-2xl bg-carbony/5 shadow-md border border-ash/20">
        <img
          src={images[0]}
          alt={judul}
          className="w-full h-auto max-h-[800px] object-cover rounded-2xl block mx-auto scale-[1.02] sm:scale-[1.03] origin-center transition-transform duration-500"
        />
      </div>
    );
  }

  // Kloning foto pertama dan terakhir untuk efek infinite loop yang seamless
  const extendedImages = [images[images.length - 1], ...images, images[0]];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(images.length);
    } else if (currentIndex === extendedImages.length - 1) {
      setCurrentIndex(1);
    }
  };

  return (
    <div className="relative group overflow-hidden w-full h-[360px] sm:h-[520px] md:h-[640px] bg-carbony/10 rounded-2xl border border-ash/20 shadow-md">
      {/* Kontainer Rel Slider Foto */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="flex w-full h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning
            ? "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {extendedImages.map((imgUrl, idx) => (
          <div key={idx} className="w-full shrink-0 h-full relative flex items-center justify-center bg-carbony/10 overflow-hidden">
            <Image
              src={imgUrl}
              alt={`${judul} - Foto ${idx}`}
              fill
              priority={idx === 1}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover scale-[1.02] sm:scale-[1.03] origin-center select-none pointer-events-none transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Tombol Navigasi Panah Kiri */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-carbon-deep/80 hover:bg-giallo text-white hover:text-black p-3 rounded-lg shadow-lg backdrop-blur-md transition-all opacity-90 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer border border-white/10"
        aria-label="Geser ke kiri"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Tombol Navigasi Panah Kanan */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-carbon-deep/80 hover:bg-giallo text-white hover:text-black p-3 rounded-lg shadow-lg backdrop-blur-md transition-all opacity-90 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer border border-white/10"
        aria-label="Geser ke kanan"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indikator Angka Foto Aktif */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white font-lambo text-xs px-3 py-1 rounded-md border border-white/10 tracking-widest font-bold z-10">
        {currentIndex > images.length ? 1 : currentIndex < 1 ? images.length : currentIndex} / {images.length}
      </div>
    </div>
  );
}

