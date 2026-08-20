import React from "react";

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Komponen JsonLd
 * 
 * Merender Structured Data JSON-LD (Schema.org) ke dalam tag <script type="application/ld+json">
 * untuk diindeks oleh mesin pencari Google (Googlebot) dan Bingbot demi meningkatkan
 * peringkat pencarian dan memunculkan Rich Snippets (Knowledge Panel, Breadcrumb, dsb).
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
