
import { fetchContentful, optimizeContentfulAsset } from "@/lib/contentful";
import { BannerItem } from "@/types/banner";

interface RawBannerItem {
  sys: { id: string };
  judul?: string;
  media?: { url?: string; title?: string } | null;
}

/**
 * Mengambil daftar item foto galeri/dokumentasi banner dari Contentful GraphQL API.
 *
 * @returns {Promise<BannerItem[]>} Larik item banner foto terformat.
 */
export async function getBannerList(): Promise<BannerItem[]> {
  const query = `
    query GetBannerList {
      bannerCollection(order: sys_publishedAt_DESC, where: { media_exists: true }) {
        items {
          sys { id }
          judul
          media { url title }
        }
      }
    }
  `;

  interface BannerQueryResponse {
    bannerCollection?: {
      items: RawBannerItem[];
    };
  }

  const data = await fetchContentful<BannerQueryResponse>(query);
  const items = data?.bannerCollection?.items || [];

  return items
    .filter((item) => item.media?.url)
    .map((item) => {
      const rawUrl = item.media?.url || "";
      return {
        id: item.sys.id,
        judul: item.judul || "Dokumentasi Dalisodo",
        mediaUrl: rawUrl.includes("ctfassets.net")
          ? optimizeContentfulAsset(rawUrl, 1200)
          : rawUrl,
      };
    });
}
