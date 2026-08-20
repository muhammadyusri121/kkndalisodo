import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getBeritaList } from "@/server/services/beritaService";
import { getWisataList } from "@/server/services/wisataService";

/**
 * Dynamic XML Sitemap Generator (app/sitemap.ts)
 * 
 * Menghasilkan peta situs XML (/sitemap.xml) yang diperbarui secara otomatis
 * setiap kali Googlebot atau perayap mesin pencari mengunjungi situs ini.
 * Memuat semua halaman statis dan seluruh entri dinamis (Wisata & Berita) dari Contentful.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [beritaList, wisataList] = await Promise.all([
    getBeritaList().catch(() => []),
    getWisataList().catch(() => []),
  ]);

  const currentDate = new Date().toISOString();

  // Halaman Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/profil`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/wisata`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/berita`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Rute Dinamis: Seluruh Destinasi Wisata
  const wisataRoutes: MetadataRoute.Sitemap = wisataList.map((item) => ({
    url: `${SITE_URL}/wisata/${item.slug || item.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Rute Dinamis: Seluruh Artikel Berita & Dokumentasi
  const beritaRoutes: MetadataRoute.Sitemap = beritaList.map((item) => ({
    url: `${SITE_URL}/berita/${item.id}`,
    lastModified: item.tanggalwaktu || currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...wisataRoutes, ...beritaRoutes];
}
