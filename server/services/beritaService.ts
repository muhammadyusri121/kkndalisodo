import { fetchContentful, optimizeContentfulAsset } from "@/lib/contentful";
import { BeritaItem } from "@/types/berita";

/**
 * Format tanggal & waktu dari Contentful (ISO string) ke format bahasa Indonesia.
 *
 * @param {string} rawDateStr - String tanggal ISO.
 * @returns {string} Tanggal terformat (contoh: 19 Agustus 2026, 14:30).
 */
export function formatTanggalWaktu(rawDateStr: string): string {
  if (!rawDateStr) return "";
  try {
    const dateObj = new Date(rawDateStr);
    if (isNaN(dateObj.getTime())) return rawDateStr;

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch {
    return rawDateStr;
  }
}

/**
 * Ekstrak teks bersih dari bidang `isi` (String Markdown / Contentful RichText JSON).
 *
 * @param {any} isi - Konten teks atau RichText.
 * @returns {string} Teks polos tanpa simbol markdown/tag HTML.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractTextFromIsi(isi: any): string {
  if (!isi) return "";

  if (typeof isi === "string") {
    return isi.replace(/[#*`_~\[\]()]/g, "").trim();
  }

  const richTextObj = isi.json || isi;
  if (richTextObj && Array.isArray(richTextObj.content)) {
    return extractTextFromRichNodes(richTextObj.content);
  }

  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromRichNodes(nodes: any[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.nodeType === "text" && node.value) {
      text += node.value + " ";
    } else if (node.content && Array.isArray(node.content)) {
      text += extractTextFromRichNodes(node.content) + " ";
    }
  }
  return text.trim();
}

/**
 * Buat cuplikan ringkasan teks singkat dengan batas karakter maksimum.
 *
 * @param {any} isi - Konten teks asli.
 * @param {number} [maxLength=140] - Panjang teks maksimum.
 * @returns {string} Teks ringkasan berakhiran "..." jika terpotong.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRingkasan(isi: any, maxLength = 140): string {
  const fullText = extractTextFromIsi(isi);
  if (fullText.length <= maxLength) return fullText;
  return fullText.substring(0, maxLength).trim() + "...";
}

interface RawAssetBlock {
  sys: { id: string };
  url?: string;
  title?: string;
  contentType?: string;
  width?: number;
  height?: number;
}

interface RawIsiLinks {
  assets?: {
    block?: RawAssetBlock[];
    hyperlink?: RawAssetBlock[];
  };
}

interface RawIsiField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json?: any;
  links?: { assets?: RawIsiLinks["assets"] };
}

interface RawContentfulPost {
  sys: { id: string; publishedAt?: string; firstPublishedAt?: string };
  judul?: string;
  cover?: { url?: string; title?: string; description?: string };
  isi?: RawIsiField | string;
  tanggalwaktu?: string;
}

/**
 * Menyisipkan data aset (foto/video) ke dalam node-node rich text yang
 * merujuk ke aset tersebut melalui sys.id.
 * Tanpa langkah ini, node `embedded-asset-block` tidak memiliki
 * `target.fields` sehingga gambar/video tidak akan tampil.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveRichTextAssets(isiJson: any, assetBlocks: RawAssetBlock[]): any {
  if (!isiJson || !Array.isArray(assetBlocks) || assetBlocks.length === 0) return isiJson;

  // Buat map id → asset agar pencarian O(1)
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
                  details: {
                    image: {
                      width: asset.width,
                      height: asset.height,
                    },
                  },
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

  return walkNode(isiJson);
}

/**
 * Mengambil daftar berita kegiatan dari Contentful GraphQL API.
 *
 * @returns {Promise<BeritaItem[]>} Larik item berita terformat.
 */
export async function getBeritaList(): Promise<BeritaItem[]> {
  const query = `query GetPostinganList {
    postinganCollection(order: sys_publishedAt_DESC) {
      items {
        sys { id publishedAt firstPublishedAt }
        judul
        cover { url title description }
        isi { json }
      }
    }
  }`;

  const data = await fetchContentful<{ postinganCollection?: { items: RawContentfulPost[] } }>(query);

  if (data && data.postinganCollection?.items && data.postinganCollection.items.length > 0) {
    return data.postinganCollection.items.map((item) => parseRawPostToBeritaItem(item));
  }

  return [];
}

/**
 * Mengambil satu berita beserta aset rich text (foto/video inline) berdasarkan ID.
 * Menggunakan query terpisah dengan `links` agar embedded-asset bisa di-resolve.
 *
 * @param {string} id - ID berita.
 * @returns {Promise<BeritaItem | null>} Objek berita atau null jika tidak ditemukan.
 */
export async function getBeritaById(id: string): Promise<BeritaItem | null> {
  const query = `query GetPostinganById($id: String!) {
    postingan(id: $id) {
      sys { id publishedAt firstPublishedAt }
      judul
      cover { url title description }
      isi {
        json
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
      }
    }
  }`;

  const data = await fetchContentful<{ postingan?: RawContentfulPost }>(query, { id });

  if (data?.postingan) {
    return parseRawPostToBeritaItem(data.postingan);
  }

  // Fallback: cari dari daftar (tanpa embedded assets)
  const allPosts = await getBeritaList();
  return allPosts.find((p) => p.id === id) || null;
}

/**
 * Mengambil daftar berita rekomendasi lainnya (mengecualikan ID berita yang sedang dibuka).
 *
 * @param {string} excludeId - ID berita yang dikecualikan.
 * @param {number} [limit=4] - Jumlah berita rekomendasi yang diambil.
 * @returns {Promise<BeritaItem[]>} Larik berita rekomendasi.
 */
export async function getOtherBeritaList(excludeId: string, limit = 4): Promise<BeritaItem[]> {
  const allPosts = await getBeritaList();
  return allPosts.filter((p) => p.id !== excludeId).slice(0, limit);
}

/**
 * Konversi mentah entri Contentful menjadi objek BeritaItem siap pakai.
 */
function parseRawPostToBeritaItem(item: RawContentfulPost): BeritaItem {
  const rawCoverUrl = item.cover?.url;
  const coverUrl = rawCoverUrl ? optimizeContentfulAsset(rawCoverUrl, 800) : "";
  const rawTanggal = item.tanggalwaktu || item.sys.firstPublishedAt || item.sys.publishedAt || new Date().toISOString();

  // Resolve embedded assets dari links ke dalam JSON rich text
  const isiRaw = item.isi as RawIsiField | string | undefined;
  let isiResolved: RawIsiField | string | undefined = isiRaw;
  if (isiRaw && typeof isiRaw === "object") {
    const assetBlocks: RawAssetBlock[] = [
      ...(isiRaw.links?.assets?.block || []),
      ...(isiRaw.links?.assets?.hyperlink || []),
    ];
    const resolvedJson = resolveRichTextAssets(isiRaw.json || isiRaw, assetBlocks);
    isiResolved = isiRaw.json ? { ...isiRaw, json: resolvedJson } : resolvedJson;
  }

  return {
    id: item.sys.id,
    judul: item.judul || "Tanpa Judul",
    coverUrl,
    cover: item.cover,
    isi: isiResolved,
    tanggalwaktu: rawTanggal,
    ringkasan: createRingkasan(isiRaw),
    kategori: "Berita & Kegiatan",
    penulis: "Admin Desa",
  };
}

