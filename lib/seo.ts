/**
 * Konfigurasi Utama & Utilitas SEO Website Desa Dalisodo
 * Menyediakan URL dasar, kata kunci target pencarian, template metadata, dan generator JSON-LD (Schema.org).
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://dalisodo-malang.desa.id");

export const SITE_NAME = "Desa Dalisodo • Kecamatan Wagir, Kabupaten Malang";
export const SITE_DEFAULT_TITLE = "Desa Dalisodo | Website Resmi & Portal Wisata Lereng Kawi Malang";
export const SITE_DEFAULT_DESCRIPTION =
  "Website resmi Pemerintah Desa Dalisodo, Kecamatan Wagir, Kabupaten Malang. Temukan informasi destinasi wisata alam lereng Gunung Kawi, berita kegiatan masyarakat, program KKN 10, profil 9 dusun, dan potensi ekonomi lokal.";

/**
 * Kumpulan kata kunci (Keywords) pencarian strategis untuk optimasi mesin pencari Google
 */
export const TARGET_KEYWORDS = [
  "Desa Dalisodo",
  "Dalisodo Wagir Malang",
  "Website Resmi Desa Dalisodo",
  "Wisata Desa Dalisodo",
  "Wisata Alam Wagir",
  "Wisata Lereng Gunung Kawi",
  "Pegunungan Putri Tidur",
  "Kampung KB Precet Dalisodo",
  "Profil Desa Dalisodo",
  "Pemerintah Desa Dalisodo",
  "KKN 10 Dalisodo",
  "Potensi Desa Dalisodo",
  "Dusun di Dalisodo",
  "Kecamatan Wagir Kabupaten Malang",
  "Agrowisata Malang",
  "Air Terjun Dalisodo",
  "Madep Manteb Manetep",
  "Desa Wisata Malang",
  "Informasi Desa Dalisodo"
];

/**
 * Generate BreadcrumbList Schema JSON-LD
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Schema Organisasi Pemerintahan Desa & Wilayah Administratif
 */
export function generateVillageOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Pemerintah Desa Dalisodo",
    alternateName: ["Desa Dalisodo", "Pemdes Dalisodo Wagir", "Desa Wisata Dalisodo"],
    url: SITE_URL,
    logo: `${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`,
    image: `${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`,
    description: SITE_DEFAULT_DESCRIPTION,
    slogan: "Madep Manteb Manetep",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Dalisodo",
      addressLocality: "Kecamatan Wagir",
      addressRegion: "Kabupaten Malang, Jawa Timur",
      postalCode: "65158",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.0125587,
      longitude: 112.519391,
      elevation: "715",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Desa Dalisodo",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Kecamatan Wagir, Kabupaten Malang",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-812-3456-7890",
      contactType: "Customer Support & Public Services",
      areaServed: "ID",
      availableLanguage: ["Indonesian", "Javanese"],
    },
    sameAs: [
      "https://malangkab.go.id",
    ],
  };
}

/**
 * Schema WebSite untuk Google Sitelinks Searchbox
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Desa Dalisodo Wagir Malang",
    alternateName: "Portal Resmi Desa Dalisodo",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/berita?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema NewsArticle untuk halaman Berita & Dokumentasi
 */
export function generateNewsArticleSchema(article: {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description || SITE_DEFAULT_DESCRIPTION,
    url: article.url.startsWith("http") ? article.url : `${SITE_URL}${article.url}`,
    image: article.imageUrl ? [article.imageUrl] : [`${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`],
    datePublished: article.publishedAt || new Date().toISOString(),
    dateModified: article.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: article.authorName || "Pemerintah Desa Dalisodo & Tim KKN 10",
    },
    publisher: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Desa Dalisodo",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url.startsWith("http") ? article.url : `${SITE_URL}${article.url}`,
    },
  };
}

/**
 * Schema TouristAttraction & Place untuk halaman Destinasi Wisata
 */
export function generateTouristAttractionSchema(wisata: {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  category?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: wisata.title,
    description: wisata.description || `Destinasi wisata alam ${wisata.title} di lereng Gunung Kawi, Desa Dalisodo, Wagir, Malang.`,
    url: wisata.url.startsWith("http") ? wisata.url : `${SITE_URL}${wisata.url}`,
    image: wisata.imageUrl ? [wisata.imageUrl] : [`${SITE_URL}/assets/image/Logo_Kabupaten_Malang.svg`],
    touristType: wisata.category && wisata.category.length > 0 ? wisata.category : ["Wisata Alam", "Ekowisata", "Agrowisata"],
    isAccessibleForFree: false,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Desa Dalisodo, Kecamatan Wagir",
      addressRegion: "Kabupaten Malang, Jawa Timur",
      postalCode: "65158",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.0125587,
      longitude: 112.519391,
      elevation: "715",
    },
    containedInPlace: {
      "@type": "Place",
      name: "Lereng Gunung Kawi, Desa Dalisodo, Wagir, Malang",
    },
  };
}
