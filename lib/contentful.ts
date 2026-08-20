// Variabel lingkungan (Environment Variables) kredensial Contentful GraphQL API
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

/**
 * Mengirim kueri GraphQL ke Contentful API secara aman dengan batas waktu (timeout) dan revalidasi cache Next.js.
 *
 * @template T - Tipe data kembalian GraphQL.
 * @param {string} query - Kueri GraphQL.
 * @param {Record<string, unknown>} variables - Variabel parameter kueri GraphQL.
 * @returns {Promise<T | null>} Data hasil kueri atau null jika terjadi kesalahan/kredensial belum diset.
 */
export async function fetchContentful<T>(query: string, variables = {}): Promise<T | null> {
  if (!SPACE_ID || !ACCESS_TOKEN || SPACE_ID === "your_contentful_space_id_here") {
    // Kembalikan null agar layanan server dapat beralih ke data lokal (fallback mock data)
    return null;
  }

  try {
    const res = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(8000), // Batas waktu 8 detik untuk mencegah koneksi gantung
        next: { revalidate: 60 }, // Revalidasi cache Next.js setiap 60 detik
      }
    );

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error(`Contentful HTTP Error: ${res.status} ${res.statusText} - Details: ${errorDetails}`);
      return null;
    }

    const { data, errors } = await res.json();
    if (errors) {
      // Cek apakah semua error adalah UNRESOLVABLE_LINK (aset belum dipublish di Contentful)
      // Jenis error ini tidak fatal — data lainnya masih valid dan bisa ditampilkan
      const isAllUnresolvable = errors.every(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => e?.extensions?.contentful?.code === "UNRESOLVABLE_LINK"
      );

      if (isAllUnresolvable && data) {
        // Hanya tampilkan warning, jangan buang data yang valid
        console.warn(
          `Contentful: ${errors.length} UNRESOLVABLE_LINK (aset belum dipublish). Data lain tetap ditampilkan.`
        );
        return data as T;
      }

      // Error lain yang benar-benar fatal
      console.error("Contentful GraphQL Errors:", JSON.stringify(errors, null, 2));
      return null;
    }

    return data as T;
  } catch (error) {
    console.error("Error fetching from Contentful:", error);
    return null;
  }
}

/**
 * Mempromosikan aset gambar dari Contentful CDN dengan kompresi WebP, kualitas 80%, dan penyesuaian lebar.
 *
 * @param {string | null} url - URL aset dari Contentful.
 * @param {number} [width] - Lebar gambar opsional (piksel).
 * @returns {string} URL gambar teroptimasi.
 */
export function optimizeContentfulAsset(url?: string | null, width?: number): string {
  if (!url) return "";
  const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
  
  // Jika aset merupakan gambar dari CDN Contentful, konversi ke format .webp dan kompresi kualitas 80%
  if (
    (cleanUrl.includes("ctfassets.net") || cleanUrl.includes("images.ctfassets.net")) &&
    !cleanUrl.endsWith(".mp4") &&
    !cleanUrl.endsWith(".webm") &&
    !cleanUrl.endsWith(".mov")
  ) {
    const separator = cleanUrl.includes("?") ? "&" : "?";
    const params: string[] = ["fm=webp", "q=80"];
    if (width) {
      params.push(`w=${width}`);
    }
    return `${cleanUrl}${separator}${params.join("&")}`;
  }
  return cleanUrl;
}
