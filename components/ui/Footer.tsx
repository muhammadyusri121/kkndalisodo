import Link from "next/link";
import Image from "next/image";
import { getWisataList } from "@/server/services/wisataService";
import BackToTopButton from "./BackToTopButton";

/**
 * Komponen Footer
 * 
 * Baris catatan kaki (footer) utama portal web Desa Dalisodo.
 * Menampilkan logo instansi, ringkasan pengabdian KKN 10, navigasi utama,
 * tautan wisata populer secara dinamis, kontak balai desa, iframe peta lokasi, serta hak cipta.
 *
 * @returns {Promise<JSX.Element>} Elemen footer komponen server (Async Server Component).
 */
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const wisataList = await getWisataList();
  const latestWisata = wisataList.slice(0, 4);

  return (
    <footer
      id="main-footer"
      aria-label="Footer Resmi Desa Dalisodo"
      className="w-full bg-carbon-deep text-white border-t border-anvil mt-0"
    >
      <div className="max-w-360 mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-20">
        
        {/* Grid Footer 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Kolom 1: Brand, Logo Instansi, Ringkasan (4 Kolom Grid) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* 3 Logo Instansi (Kabupaten Malang, UNMER Malang, KKN 10) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Logo 1: Kabupaten Malang */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-white p-1 border border-white/30 rounded-full overflow-hidden shadow-md hover:scale-110 hover:border-giallo transition-all duration-300">
                  <Image
                    src="/assets/image/Logo_Kabupaten_Malang.svg"
                    alt="Logo Kabupaten Malang"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>

                {/* Logo 2: Universitas Merdeka Malang */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-white p-1 border border-white/30 rounded-full overflow-hidden shadow-md hover:scale-110 hover:border-giallo transition-all duration-300">
                  <Image
                    src="/assets/image/Logo_Unmer_resmi.svg"
                    alt="Logo Universitas Merdeka Malang"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>

                {/* Logo 3: KKN 10 Dalisodo */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-white p-1 border border-white/30 rounded-full overflow-hidden shadow-md hover:scale-110 hover:border-giallo transition-all duration-300">
                  <Image
                    src="/assets/image/Logo-kkn10.svg"
                    alt="Logo KKN 10 Dalisodo"
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Judul & Subtitle Brand */}
              <div className="flex flex-col">
                <span className="font-lambo text-lg sm:text-xl font-bold uppercase tracking-[0.023em] text-white leading-tight">
                  DESA DALISODO
                </span>
                <span className="font-lambo text-[10px] text-giallo tracking-[0.12em] font-semibold uppercase">
                  KAB. MALANG • UNIVERSITAS MERDEKA • KKN 10
                </span>
              </div>
            </div>

            {/* Deskripsi Ringkas Kolaborasi */}
            <p className="font-lambo text-xs sm:text-sm text-steel leading-relaxed tracking-[0.023em] max-w-md">
              Ruang informasi menampilkan keindahan destinasi lokal, cerita keseharian warga dan jejak kolaborasi mahasiswa KKN 10 Dalisodo bersama masyarakat desa.
            </p>

            {/* Lencana (Tag Badges) */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="font-lambo text-[10px] uppercase tracking-wider text-giallo bg-black/60 px-3 py-1 rounded-md border border-white/10 hover:border-giallo hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                KKN 10 DALISODO
              </span>
              <span className="font-lambo text-[10px] uppercase tracking-wider text-slate-300 bg-white/5 px-3 py-1 rounded-md border border-white/10 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                WAGIR MALANG
              </span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Utama Halaman (2 Kolom Grid) */}
          <nav aria-label="Navigasi Footer" className="lg:col-span-2 space-y-4">
            <h3 className="font-lambo text-xs font-bold uppercase tracking-[0.15em] text-giallo border-b border-anvil pb-2">
              NAVIGASI UTAMA
            </h3>
            <ul className="space-y-2.5 font-lambo text-xs sm:text-sm uppercase tracking-[0.023em]">
              <li>
                <Link href="/" className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300">
                  BERANDA
                </Link>
              </li>
              <li>
                <Link href="/wisata" className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300">
                  WISATA DESA
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300">
                  BERITA KEGIATAN
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300">
                  PROFIL DESA
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kolom 3: Tautan Destinasi Wisata Populer Dinamis (2 Kolom Grid) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-lambo text-xs font-bold uppercase tracking-[0.15em] text-giallo border-b border-anvil pb-2">
              DESTINASI WISATA
            </h3>
            <ul className="space-y-2.5 font-lambo text-xs sm:text-sm uppercase tracking-[0.023em]">
              {latestWisata.length > 0 ? (
                latestWisata.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/wisata/${item.slug || item.id}`}
                      className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300 line-clamp-1"
                    >
                      {item.judul.toUpperCase()}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/wisata"
                    className="text-slate-300 hover:text-giallo hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    JELAJAHI WISATA
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Kolom 4: Informasi Kontak & Embed Peta Google Maps (4 Kolom Grid) */}
          <address className="not-italic lg:col-span-4 space-y-4">
            <h3 className="font-lambo text-xs font-bold uppercase tracking-[0.15em] text-giallo border-b border-anvil pb-2">
              KONTAK & LOKASI DESA
            </h3>
            <div className="space-y-2.5 font-lambo text-xs text-slate-300 uppercase tracking-[0.023em]">
              <p className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-giallo shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span>JL. RAYA DALISODO NO. 123, WAGIR MALANG</span>
              </p>
              <p className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-giallo shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92Z" />
                </svg>
                <a href="tel:+6281234567890" className="hover:text-giallo transition-colors">+62 812-3456-7890</a>
              </p>
              <p className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-giallo shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6L12 13L2 6" />
                </svg>
                <a href="mailto:layanan@dalisodo.desa.id" className="lowercase hover:text-giallo transition-colors">layanan@dalisodo.desa.id</a>
              </p>
              <p className="flex items-center gap-2.5 pt-1 text-giallo-dark font-semibold">
                <svg className="w-4 h-4 text-giallo shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6V12L16 14" />
                </svg>
                <span>SENIN - JUMAT (08:00 - 15:30 WIB)</span>
              </p>
            </div>

            {/* Peta Google Maps Embed */}
            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-white/10 mt-3 group hover:border-giallo transition-colors shadow-sm">
              <iframe
                id="footer-map-iframe"
                title="Peta Lokasi Desa Dalisodo Wagir Malang"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15804.85521096782!2d112.51939105!3d-8.012558699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e789db8e3bbca7b%3A0xc3b86dbb531cd8d4!2sDalisodo%2C%20Wagir%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0 filter contrast-[1.05] opacity-90 group-hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </address>

        </div>

        {/* Hak Cipta (Copyright) & Tombol Kembali ke Atas */}
        <div className="border-t border-anvil pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs font-lambo tracking-wider uppercase text-steel gap-4">
          <p id="footer-copyright">
            © {currentYear} KKN 10 DESA DALISODO • KABUPATEN MALANG. HAK CIPTA DILINDUNGI.
          </p>
          <div className="flex items-center gap-4">
            <BackToTopButton />
          </div>
        </div>

      </div>
    </footer>
  );
}

