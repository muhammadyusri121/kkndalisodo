
import { fetchContentful, optimizeContentfulAsset } from "@/lib/contentful";
import { HeroSlideItem } from "@/types/hero";

/**
 * Mengambil daftar item slide hero banner utama dari gabungan Contentful (Banner, Postingan Berita, dan Wisata).
 *
 * @returns {Promise<HeroSlideItem[]>} Larik item slide hero terformat.
 */
export async function getHeroSlides(): Promise<HeroSlideItem[]> {
  const query = `
    query GetHeroData {
      bannerCollection(limit: 2, order: sys_publishedAt_DESC, where: { media_exists: true }) {
        items {
          sys { id }
          judul
          media { url }
        }
      }
      postinganCollection(limit: 2, order: sys_publishedAt_DESC, where: { cover_exists: true }) {
        items {
          sys { id }
          judul
          cover { url }
        }
      }
      wisataCollection(limit: 2, where: { thumbnail_exists: true }) {
        items {
          sys { id }
          judul
          thumbnail { url }
        }
      }
    }
  `;

  interface HeroQueryResponse {
    bannerCollection?: {
      items: Array<{ sys: { id: string }; judul?: string; media?: { url?: string } }>;
    };
    postinganCollection?: {
      items: Array<{ sys: { id: string }; judul?: string; cover?: { url?: string } }>;
    };
    wisataCollection?: {
      items: Array<{ sys: { id: string }; judul?: string; thumbnail?: { url?: string } }>;
    };
  }

  const data = await fetchContentful<HeroQueryResponse>(query);
  const slides: HeroSlideItem[] = [];

  // 1. Ambil 2 Banner / Dokumentasi terbaru (CTA mengarah ke seksi #dokumentasi)
  const bannerItems = data?.bannerCollection?.items || [];
  for (const item of bannerItems) {
    const rawUrl = item.media?.url || "";
    if (!rawUrl) continue;
    slides.push({
      id: `banner-${item.sys.id}`,
      judul: item.judul || "Dokumentasi Dalisodo",
      thumbnailUrl: optimizeContentfulAsset(rawUrl, 1920),
      kategori: "Dokumentasi",
      ctaLink: "#dokumentasi",
    });
  }

  // 2. Ambil 2 Berita kegiatan terbaru (CTA mengarah ke /berita)
  const beritaItems = data?.postinganCollection?.items || [];
  for (const item of beritaItems) {
    const rawUrl = item.cover?.url || "";
    if (!rawUrl) continue;
    slides.push({
      id: `berita-${item.sys.id}`,
      judul: item.judul || "Berita Terkini",
      thumbnailUrl: optimizeContentfulAsset(rawUrl, 1920),
      kategori: "Berita",
      ctaLink: "/berita",
    });
  }

  // 3. Ambil 2 Wisata unggulan terbaru (CTA mengarah ke /wisata/[slug])
  const wisataItems = data?.wisataCollection?.items || [];
  for (const item of wisataItems) {
    const rawUrl = item.thumbnail?.url || "";
    if (!rawUrl) continue;

    const judulText = item.judul || "Wisata Dalisodo";
    const slug = judulText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    slides.push({
      id: `wisata-${item.sys.id}`,
      judul: judulText,
      thumbnailUrl: optimizeContentfulAsset(rawUrl, 1920),
      kategori: "Wisata",
      ctaLink: `/wisata/${slug || item.sys.id}`,
    });
  }

  return slides;
}
