import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Generator Robots.txt Dinamis (app/robots.ts)
 * 
 * Mengatur instruksi pengindeksan untuk mesin pencari Googlebot, Bingbot, dll.
 * Mengizinkan perayapan di seluruh halaman publik dan mengarahkan ke file /sitemap.xml.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
