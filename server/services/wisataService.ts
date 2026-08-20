import { fetchContentful, optimizeContentfulAsset } from "@/lib/contentful";
import { WisataItem } from "@/types/wisata";

// ─── Tipe internal ────────────────────────────────────────────────────────────

interface RawAssetBlock {
  sys: { id: string };
  url?: string;
  title?: string;
  contentType?: string;
  width?: number;
  height?: number;
}

interface RawRichTextLinks {
  assets?: {
    block?: RawAssetBlock[];
    hyperlink?: RawAssetBlock[];
  };
}

interface RawRichTextField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json?: any;
  links?: RawRichTextLinks;
}

interface RawWisataItem {
  sys: { id: string };
  judul?: string;
  thumbnail?: { url?: string };
  deskripsi?: RawRichTextField;
  detailInformasi?: RawRichTextField;
  galerryCollection?: { items?: Array<{ url?: string } | null> };
  galeriCollection?: { items?: Array<{ url?: string } | null> };
}

// ─── Helper: sisipkan data aset ke node rich text ─────────────────────────────

/**
 * Menyisipkan data aset (foto/video) ke dalam node-node rich text
 * yang merujuk ke aset melalui sys.id.
 * Diperlukan karena Contentful GraphQL menyimpan referensi aset terpisah
 * di blok `links`, bukan langsung di node JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveRichTextAssets(richJson: any, assetBlocks: RawAssetBlock[]): any {
  if (!richJson || !Array.isArray(assetBlocks) || assetBlocks.length === 0) return richJson;

  const assetMap = new Map<string, RawAssetBlock>();
  for (const asset of assetBlocks) {
    if (asset?.sys?.id) assetMap.set(asset.sys.id, asset);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walkNode(node: any): any {
    if (!node) return node;
    if (
      node.nodeType === "embedded-asset-block" ||
      node.nodeType === "asset-hyperlink"
    ) {
      const refId = node.data?.target?.sys?.id;
      if (refId && assetMap.has(refId)) {
        const asset = assetMap.get(refId)!;
        return {
          ...node,
          data: {
            ...node.data,
            target: {
              ...node.data?.target,
              fields: {
                title: asset.title || "",
                file: {
                  url: asset.url || "",
                  contentType: asset.contentType || "",
                  details: { image: { width: asset.width, height: asset.height } },
                },
              },
            },
          },
        };
      }
    }
    if (Array.isArray(node.content)) {
      return { ...node, content: node.content.map(walkNode) };
    }
    return node;
  }

  return walkNode(richJson);
}

/**
 * Resolve field rich text lengkap: sisipkan aset dari links ke JSON.
 */
function resolveField(field?: RawRichTextField): RawRichTextField | null {
  if (!field) return null;
  const assetBlocks: RawAssetBlock[] = [
    ...(field.links?.assets?.block || []),
    ...(field.links?.assets?.hyperlink || []),
  ];
  const resolvedJson = resolveRichTextAssets(field.json, assetBlocks);
  return { ...field, json: resolvedJson };
}

// ─── Helper: parse raw item → WisataItem ─────────────────────────────────────

function parseRawWisataItem(item: RawWisataItem): WisataItem {
  const galeriItems = (item.galerryCollection?.items || item.galeriCollection?.items || [])
    .filter((g): g is { url: string } => !!g?.url);
  const galeriUrls = galeriItems
    .map((g) => optimizeContentfulAsset(g.url, 1200))
    .filter(Boolean);

  const judulText = item.judul || "Wisata Dalisodo";
  const slug = judulText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return {
    id: item.sys.id,
    slug: slug || item.sys.id,
    judul: judulText,
    kategori: ["Wisata Alam"],
    deskripsi: resolveField(item.deskripsi),
    detailInformasi: resolveField(item.detailInformasi),
    thumbnailUrl: optimizeContentfulAsset(item.thumbnail?.url, 800) || "",
    galeriUrls,
  };
}

// ─── Fragment links untuk rich text ──────────────────────────────────────────

const RICH_TEXT_LINKS_FRAGMENT = `
  links {
    assets {
      block {
        sys { id }
        url
        title
        contentType
        width
        height
      }
      hyperlink {
        sys { id }
        url
        title
        contentType
      }
    }
  }
`;

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Mengambil seluruh daftar destinasi wisata (tanpa links rich text — untuk performa daftar).
 *
 * @returns {Promise<WisataItem[]>} Larik item destinasi wisata.
 */
export async function getWisataList(): Promise<WisataItem[]> {
  const query = `query GetWisataList {
    wisataCollection(where: { thumbnail_exists: true }) {
      items {
        sys { id }
        judul
        deskripsi { json }
        detailInformasi { json }
        thumbnail { url }
        galerryCollection {
          items { url }
        }
      }
    }
  }`;

  const data = await fetchContentful<{ wisataCollection?: { items: RawWisataItem[] } }>(query);

  if (data && data.wisataCollection?.items && data.wisataCollection.items.length > 0) {
    return data.wisataCollection.items
      .filter((item) => !!item?.sys?.id)
      .map(parseRawWisataItem)
      .filter((item) => !!item.thumbnailUrl);
  }

  return [];
}

/**
 * Mengambil satu destinasi wisata berdasarkan slug/ID — dengan links rich text
 * agar gambar & video di dalam deskripsi/detail dapat di-resolve dan ditampilkan.
 *
 * @param {string} slug - Slug atau ID wisata.
 * @returns {Promise<WisataItem | null>} Objek wisata atau null.
 */
export async function getWisataBySlug(slug: string): Promise<WisataItem | null> {
  // Cari ID dari daftar terlebih dahulu (slug di-generate dari judul)
  const allWisata = await getWisataList();
  const found = allWisata.find((item) => item.slug === slug || item.id === slug);
  if (!found) return null;

  // Ambil data lengkap dengan links untuk halaman detail
  const query = `query GetWisataById($id: String!) {
    wisata(id: $id) {
      sys { id }
      judul
      thumbnail { url }
      deskripsi {
        json
        ${RICH_TEXT_LINKS_FRAGMENT}
      }
      detailInformasi {
        json
        ${RICH_TEXT_LINKS_FRAGMENT}
      }
      galerryCollection {
        items { url }
      }
    }
  }`;

  const data = await fetchContentful<{ wisata?: RawWisataItem }>(query, { id: found.id });

  if (data?.wisata) {
    return parseRawWisataItem(data.wisata);
  }

  // Fallback ke data daftar (tanpa embedded assets)
  return found;
}

/**
 * Mengambil daftar destinasi wisata rekomendasi lainnya.
 *
 * @param {string} excludeSlugOrId - Slug atau ID yang dikecualikan.
 * @param {number} [limit=4] - Jumlah wisata rekomendasi.
 * @returns {Promise<WisataItem[]>} Larik wisata rekomendasi.
 */
export async function getOtherWisataList(excludeSlugOrId: string, limit = 4): Promise<WisataItem[]> {
  const allWisata = await getWisataList();
  return allWisata
    .filter((w) => w.slug !== excludeSlugOrId && w.id !== excludeSlugOrId)
    .slice(0, limit);
}
