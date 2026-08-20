"use client";

import { useState, useEffect, useMemo } from "react";
import { ProfilDesa } from "@/types/profil";
import GambaranUmumSection from "./sections/GambaranUmumSection";
import GeografiSection from "./sections/GeografiSection";
import DusunSection from "./sections/DusunSection";
import PemerintahanSection from "./sections/PemerintahanSection";
import DemografiSection from "./sections/DemografiSection";
import FasilitasSection from "./sections/FasilitasSection";
import EkonomiSection from "./sections/EkonomiSection";
import SosialBudayaSection from "./sections/SosialBudayaSection";

interface ProfilSectionProps {
  data: ProfilDesa;
}


/**
 * Komponen ProfilSection
 * 
 * Pengelola utama halaman Profil Desa Dalisodo.
 * Menyediakan bilah navigasi lengket (sticky nav) dengan fitur pelacakan posisi gulir (ScrollSpy),
 * serta menggabungkan 8 seksi modular (Gambaran Umum, Geografi, Dusun, Pemerintahan, Demografi, Fasilitas, Ekonomi, Sosial Budaya).
 *
 * @param {ProfilSectionProps} props - Data komprehensif profil desa Dalisodo.
 * @returns {JSX.Element} Elemen halaman profil desa terintegrasi.
 */
export default function ProfilSection({ data }: ProfilSectionProps) {
  const [activeSection, setActiveSection] = useState<string>("gambaran-umum");

  const NAVIGATION_TABS = useMemo(() => [
    { id: "gambaran-umum", label: "GAMBARAN UMUM" },
    { id: "geografi", label: "GEOGRAFI & BATAS" },
    { id: "dusun", label: "DUSUN" },
    { id: "pemerintahan", label: "PEMERINTAHAN" },
    { id: "demografi", label: "DEMOGRAFI" },
    { id: "fasilitas", label: "SARANA & PRASARANA" },
    { id: "ekonomi", label: "EKONOMI" },
    { id: "sosbud", label: "SOSIAL & BUDAYA" },
  ], []);

  // Pelacak posisi gulir (ScrollSpy) menggunakan IntersectionObserver
  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    });

    NAVIGATION_TABS.forEach((tab) => {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [NAVIGATION_TABS]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="w-full">
      {/* Bilah Navigasi Sticky Sub-Seksi Profil (ScrollSpy Tab Bar) */}
      <nav
        aria-label="Navigasi Profil Desa"
        className="sticky top-16 sm:top-20 z-40 w-full bg-carbon-deep/95 backdrop-blur-md border-y border-anvil shadow-xl"
      >
        <div className="max-w-360 mx-auto px-3 sm:px-6 lg:px-8 py-2.5 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex items-center justify-start xl:justify-center gap-1.5 sm:gap-2">
          {NAVIGATION_TABS.map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`font-lambo text-xs sm:text-sm tracking-[0.03em] uppercase px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-giallo text-pure-black font-bold shadow-md scale-100"
                    : "text-slate-300 hover:text-white hover:bg-white/10 font-semibold"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Kontainer Seksi-Seksi Modular Profil Desa */}
      <div className="max-w-360 mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 space-y-16 sm:space-y-24">
        {/* 1. Gambaran Umum & Visi Misi */}
        <GambaranUmumSection data={data} />

        {/* 2. Geografi & Batas Wilayah */}
        <GeografiSection data={data} />

        {/* 3. Wilayah Dusun */}
        <DusunSection data={data} />

        {/* 4. Pemerintahan Desa & Bagan Organisasi */}
        <PemerintahanSection data={data} />

        {/* 5. Demografi & Statistik Kependudukan */}
        <DemografiSection data={data} />

        {/* 6. Sarana & Prasarana Desa */}
        <FasilitasSection data={data} />

        {/* 7. Potensi Ekonomi & Pertanian */}
        <EkonomiSection data={data} />

        {/* 8. Sosial, Budaya & Kelembagaan */}
        <SosialBudayaSection data={data} />

        {/* Catatan Kaki & Sumber Data Resmi */}
        <footer className="bg-marble p-6 sm:p-8 rounded-lg border border-ash/20 text-slate-500 text-sm italic leading-relaxed space-y-2.5">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-steel" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
              <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" />
            </svg>
            <span className="font-lambo not-italic font-bold uppercase text-steel text-sm">
              CATATAN DAN SUMBER DATA
            </span>
          </div>
          <p>{data.catatanSumberData}</p>
        </footer>
      </div>
    </div>
  );
}
