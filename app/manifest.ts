import { MetadataRoute } from "next";
import { SITE_NAME, SITE_DEFAULT_DESCRIPTION } from "@/lib/seo";

/**
 * Generator Web App Manifest (app/manifest.ts)
 * 
 * Memberikan informasi aplikasi web progresif (PWA) kepada Googlebot dan peramban ponsel pintar
 * untuk meningkatkan sinyal mobile-friendly dan SEO modern.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Desa Dalisodo",
    description: SITE_DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#ffc000",
    icons: [
      {
        src: "/assets/image/Logo-kkn10.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
