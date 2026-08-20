"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Komponen Navbar
 * 
 * Bilah navigasi atas (header) aplikasi portal web Desa Dalisodo.
 * Menampilkan 3 logo instansi (Kabupaten Malang, UNMER, KKN 10), nama brand,
 * menu navigasi desktop, efek glassmorphism saat digulir (scroll), serta menu hamburger seluler (mobile).
 *
 * @returns {JSX.Element} Elemen header navigasi portal.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "BERANDA" },
    { href: "/wisata", label: "WISATA DESA" },
    { href: "/berita", label: "BERITA KEGIATAN" },
    { href: "/profil", label: "PROFIL DESA" },
  ];

  // ── Deteksi posisi scroll layar untuk mengaktifkan latar belakang glassmorphism ──
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeaderActive = isScrolled || isMenuOpen;

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 ${
        isHeaderActive
          ? "bg-carbon-deep/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-0"
          : "bg-transparent border-b border-transparent py-2"
      }`}
    >
      <div className="max-w-360 mx-auto px-4 sm:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between min-w-0">
        
        {/* Brand Header: 3 Logo Instansi (Kabupaten Malang + UNMER + KKN 10) & Nama Desa */}
        <Link
          id="navbar-brand-link"
          href="/"
          className="flex items-center gap-2 sm:gap-3 group shrink min-w-0"
          aria-label="Kembali ke Beranda Desa Dalisodo"
        >
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Logo 1: Kabupaten Malang */}
            <div className="relative w-7 h-7 sm:w-9 sm:h-9 shrink-0 bg-white p-0.5 sm:p-1 border border-white/30 rounded-full overflow-hidden group-hover:border-giallo transition-colors shadow-sm">
              <Image
                src="/assets/image/Logo_Kabupaten_Malang.svg"
                alt="Logo Kabupaten Malang"
                fill
                sizes="(max-width: 640px) 28px, 36px"
                className="object-contain"
              />
            </div>

            {/* Logo 2: Universitas Merdeka Malang */}
            <div className="relative w-7 h-7 sm:w-9 sm:h-9 shrink-0 bg-white p-0.5 sm:p-1 border border-white/30 rounded-full overflow-hidden group-hover:border-giallo transition-colors shadow-sm">
              <Image
                src="/assets/image/Logo_Unmer_resmi.svg"
                alt="Logo Universitas Merdeka Malang"
                fill
                sizes="(max-width: 640px) 28px, 36px"
                className="object-contain"
              />
            </div>

            {/* Logo 3: KKN 10 Dalisodo */}
            <div className="relative w-7 h-7 sm:w-9 sm:h-9 shrink-0 bg-white p-0.5 sm:p-1 border border-white/30 rounded-full overflow-hidden group-hover:border-giallo transition-colors shadow-sm">
              <Image
                src="/assets/image/Logo-kkn10.svg"
                alt="Logo KKN 10 Dalisodo"
                fill
                sizes="(max-width: 640px) 28px, 36px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Nama & Subtitle Brand */}
          <div className="flex flex-col min-w-0 shrink">
            <span className="font-lambo font-bold text-xs sm:text-base md:text-lg tracking-[0.023em] text-white uppercase leading-none group-hover:text-giallo transition-colors truncate">
              DESA DALISODO
            </span>
            <span className="hidden sm:block font-lambo text-[10px] text-giallo tracking-[0.12em] font-semibold uppercase mt-1 truncate">
              KAB. MALANG • UNIVERSITAS MERDEKA • KKN 10
            </span>
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav
          id="desktop-nav-menu"
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-2 lg:gap-6"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-lambo text-xs sm:text-sm font-semibold tracking-[0.023em] uppercase px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-giallo text-black font-bold shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Hamburger Tampilan Seluler (Mobile) */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none transition-colors cursor-pointer border border-white/10"
            aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              strokeLinejoin="miter"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Dropdown Tampilan Seluler (Mobile Dropdown) */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-dropdown"
          aria-label="Navigasi Seluler"
          className="md:hidden border-t border-white/10 bg-carbon-deep/80 backdrop-blur-xl px-6 py-4 space-y-2 shadow-2xl"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
                href={link.href}
                className={`font-lambo block px-4 py-3 text-sm font-semibold tracking-[0.023em] uppercase rounded-lg transition-colors ${
                  isActive
                    ? "bg-giallo text-black font-bold"
                    : "text-slate-200 hover:bg-white/10 hover:text-giallo"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

