/**
 * Komponen ContactSection
 * 
 * Menampilkan seksi informasi kontak Balai Desa Dalisodo dan peta lokasi interaktif (Google Maps).
 * Seksi ini mencakup alamat resmi, nomor telepon hotline, email pelayanan, jam operasional,
 * serta peta embed lokasi Desa Dalisodo.
 *
 * @returns {JSX.Element} Elemen seksi kontak yang responsif dan teraksesibilitas.
 */
export default function ContactSection() {
  return (
    <section
      id="kontak"
      aria-labelledby="kontak-heading"
      className="w-full bg-[#ffffff] text-carbony py-16 sm:py-20 px-6 sm:px-12 lg:px-16 max-w-360 mx-auto border-t border-marble"
    >
      {/* Header Seksi: Judul & Deskripsi Singkat */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-carbony mb-8 sm:mb-12">
        <div>
          <span className="font-lambo text-xs tracking-[0.15em] text-emerald-dalisodo font-bold uppercase block mb-1">
            LAYANAN & LOKASI BALAI DESA
          </span>
          <h2
            id="kontak-heading"
            className="font-lambo text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.023em] text-carbony"
          >
            INFORMASI KONTAK
          </h2>
        </div>
        <p className="font-lambo text-xs sm:text-sm text-steel uppercase tracking-[0.023em] max-w-sm">
          SILAKAN HUBUNGI KAMI UNTUK INFORMASI PELAYANAN MASYARAKAT, POTENSI DESA, SERTA PROGRAM KKN 10.
        </p>
      </div>

      {/* Tata Letak Utama: Daftar Informasi Kontak (Kiri) & Peta Lokasi (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Kolom Informasi Kontak */}
        <address className="not-italic lg:col-span-5 space-y-6">
          
          {/* Alamat Balai Desa */}
          <div className="flex items-start gap-4 pb-5 border-b border-marble group hover:translate-x-1.5 transition-transform duration-300 cursor-default">
            <div className="w-10 h-10 rounded-lg bg-giallo/10 text-giallo-dark flex items-center justify-center border border-giallo/20 shrink-0 group-hover:bg-giallo group-hover:text-pure-black transition-colors shadow-2xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-lambo text-sm sm:text-base font-bold uppercase text-carbony tracking-[0.023em] group-hover:text-giallo-dark transition-colors">
                ALAMAT BALAI DESA
              </h3>
              <p className="font-sans text-xs sm:text-sm text-steel leading-relaxed">
                Jl. Raya Dalisodo No. 123, Kecamatan Wagir, Kabupaten Malang, Jawa Timur 65158
              </p>
            </div>
          </div>

          {/* Telepon & Hotline */}
          <div className="flex items-start gap-4 pb-5 border-b border-marble group hover:translate-x-1.5 transition-transform duration-300 cursor-default">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-dalisodo flex items-center justify-center border border-emerald-200/80 shrink-0 group-hover:bg-emerald-dalisodo group-hover:text-white transition-colors shadow-2xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92Z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-lambo text-sm sm:text-base font-bold uppercase text-carbony tracking-[0.023em] group-hover:text-giallo-dark transition-colors">
                TELEPON / HOTLINE
              </h3>
              <p className="font-lambo text-sm sm:text-base text-carbony tracking-[0.023em] font-bold">
                +62 812-3456-7890
              </p>
              <span className="font-lambo text-[10px] text-giallo-dark uppercase tracking-wider block">
                PELAYANAN MASYARAKAT DESA
              </span>
            </div>
          </div>

          {/* Email Resmi */}
          <div className="flex items-start gap-4 pb-5 border-b border-marble group hover:translate-x-1.5 transition-transform duration-300 cursor-default">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/80 shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors shadow-2xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6L12 13L2 6" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-lambo text-sm sm:text-base font-bold uppercase text-carbony tracking-[0.023em] group-hover:text-giallo-dark transition-colors">
                EMAIL RESMI
              </h3>
              <p className="font-sans text-xs sm:text-sm text-carbony font-semibold break-all">
                layanan@dalisodo.desa.id
              </p>
              <span className="font-lambo text-[10px] text-giallo-dark uppercase tracking-wider block">
                TIM KKN 10 & PERANGKAT DESA
              </span>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="flex items-start gap-4 pt-1 group hover:translate-x-1.5 transition-transform duration-300 cursor-default">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/80 shrink-0 group-hover:bg-giallo group-hover:text-pure-black transition-colors shadow-2xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6V12L16 14" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-lambo text-sm sm:text-base font-bold uppercase text-carbony tracking-[0.023em] group-hover:text-giallo-dark transition-colors">
                JAM PELAYANAN BALAI DESA
              </h3>
              <p className="font-lambo text-xs sm:text-sm text-anvil uppercase tracking-wider font-semibold">
                SENIN - JUMAT: 08:00 - 15:30 WIB
              </p>
              <span className="font-lambo text-[10px] text-steel uppercase tracking-wider block">
                SABTU, MINGGU & HARI LIBUR: TUTUP
              </span>
            </div>
          </div>

        </address>

        {/* Kolom Peta Google Maps Embed */}
        <div className="lg:col-span-7 min-h-95 lg:min-h-115 rounded-lg overflow-hidden bg-carbony relative border border-ash/20 shadow-sm hover:shadow-xl hover:border-giallo/50 transition-all duration-500">
          <iframe
            id="kontak-map-iframe"
            title="Peta Lokasi Desa Dalisodo Wagir Malang"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15804.85521096782!2d112.51939105!3d-8.012558699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e789db8e3bbca7b%3A0xc3b86dbb531cd8d4!2sDalisodo%2C%20Wagir%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
            className="absolute inset-0 w-full h-full filter contrast-[1.05] opacity-95"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
}


