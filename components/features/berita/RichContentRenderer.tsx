

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";

interface RichContentRendererProps {
  content: any;
}

/**
 * Komponen RichContentRenderer
 * 
 * Pengolah dan penyaji dokumen Rich Text dari Contentful ke elemen-elemen HTML/React yang dinamis.
 * Mendukung paragraf, judul (H1-H6), daftar (ul/ol), kutipan (blockquote), gambar bersampul,
 * tabel interaktif, format teks (tebal, miring, garis bawah, kode), serta tautan aman.
 *
 * @param {RichContentRendererProps} props - Properti komponen berisi objek konten Rich Text.
 * @returns {JSX.Element} Elemen terstruktur dokumen berita/artikel.
 */
export default function RichContentRenderer({ content }: RichContentRendererProps) {
  if (!content) {
    return <p className="italic opacity-70">Konten tidak tersedia.</p>;
  }

  // Penanganan jika konten dikirim berupa teks biasa (string)
  if (typeof content === "string") {
    const paragraphs = content.split("\n\n").filter(Boolean);
    return (
      <>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </>
    );
  }

  const richJson = content.json || content;

  // Penanganan jika konten merupakan dokumen Rich Text Contentful
  if (richJson && richJson.nodeType === "document" && Array.isArray(richJson.content)) {
    return (
      <>
        {richJson.content.map((node: any, idx: number) => renderRichNode(node, idx))}
      </>
    );
  }

  return <p className="italic opacity-70">Format konten tidak dapat ditampilkan.</p>;
}

/**
 * Menerjemahkan satu simpul (node) dokumen Rich Text ke komponen React.
 */
function renderRichNode(node: any, index: number): React.ReactNode {
  if (!node) return null;

  switch (node.nodeType) {
    case "paragraph": {
      // Abaikan paragraf kosong tanpa teks
      if (!node.content || node.content.length === 0) return null;
      const allEmpty = node.content.every(
        (c: any) => c.nodeType === "text" && (!c.value || c.value.trim() === "")
      );
      if (allEmpty) return null;
      return <p key={index}>{renderNodeContent(node.content)}</p>;
    }
    case "heading-1":
      return <h1 key={index}>{renderNodeContent(node.content)}</h1>;
    case "heading-2":
      return <h2 key={index}>{renderNodeContent(node.content)}</h2>;
    case "heading-3":
      return <h3 key={index}>{renderNodeContent(node.content)}</h3>;
    case "heading-4":
      return <h4 key={index}>{renderNodeContent(node.content)}</h4>;
    case "heading-5":
      return <h5 key={index}>{renderNodeContent(node.content)}</h5>;
    case "heading-6":
      return <h6 key={index}>{renderNodeContent(node.content)}</h6>;
    case "unordered-list":
      return (
        <ul key={index}>
          {node.content?.map((item: any, i: number) => (
            <li key={i}>{renderNodeContent(item.content)}</li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol key={index}>
          {node.content?.map((item: any, i: number) => (
            <li key={i}>{renderNodeContent(item.content)}</li>
          ))}
        </ol>
      );
    case "blockquote":
      return <blockquote key={index}>{renderNodeContent(node.content)}</blockquote>;
    case "embedded-asset-block": {
      const assetFile = node.data?.target?.fields?.file;
      const assetUrl = assetFile?.url;
      const assetTitle = node.data?.target?.fields?.title || "";
      const contentType: string = assetFile?.contentType || "";

      if (!assetUrl) return null;

      const resolvedUrl = assetUrl.startsWith("//") ? `https:${assetUrl}` : assetUrl;

      // Render video — tetap full-width agar kontrol mudah dioperasikan
      if (contentType.startsWith("video/")) {
        return (
          <figure key={index} className="my-6 w-full">
            <video
              src={resolvedUrl}
              controls
              playsInline
              className="w-full rounded-xl"
              style={{ maxHeight: "560px" }}
            >
              <source src={resolvedUrl} type={contentType} />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </figure>
        );
      }

      // Render gambar:
      // - Mobile  : lebar mengikuti ukuran alami gambar (tidak dipaksakan penuh)
      // - Desktop : dibatasi max 560px dan di-tengah agar tidak terlalu lebar
      return (
        <figure key={index} className="my-6 flex justify-center">
          <Image
            src={resolvedUrl}
            alt={assetTitle || "Gambar Berita"}
            width={1200}
            height={675}
            sizes="(max-width: 640px) 100vw, 560px"
            style={{ width: "100%", height: "auto", maxWidth: "560px" }}
            className="rounded-xl"
          />
        </figure>
      );
    }
    case "table":
      return (
        <div key={index} className="not-prose w-full my-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse m-0 p-0">
              <tbody>
                {node.content?.map((rowNode: any, rIdx: number) => renderRichNode(rowNode, rIdx))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "table-row":
      return (
        <tr key={index} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors">
          {node.content?.map((cellNode: any, cIdx: number) => renderRichNode(cellNode, cIdx))}
        </tr>
      );
    case "table-header-cell":
      return (
        <th
          key={index}
          className="bg-slate-100/90 text-carbony font-sans font-bold px-4 sm:px-5 py-3 border-r border-slate-200 last:border-r-0 text-xs sm:text-sm uppercase tracking-wider align-middle m-0"
        >
          <div className="m-0 p-0 leading-normal font-bold text-carbony">
            {renderCellContent(node.content)}
          </div>
        </th>
      );
    case "table-cell":
      return (
        <td
          key={index}
          className="px-4 sm:px-5 py-3 text-slate-700 font-sans border-r border-slate-200 last:border-r-0 text-sm sm:text-base leading-normal align-middle m-0 bg-white"
        >
          <div className="m-0 p-0 leading-normal text-slate-700">
            {renderCellContent(node.content)}
          </div>
        </td>
      );
    case "hr":
      return <hr key={index} />;
    case "embedded-entry-block": {
      // Fallback: tampilkan judul entry sebagai blockquote jika ada
      const entryFields = node.data?.target?.fields;
      const entryTitle =
        entryFields?.judul ||
        entryFields?.title ||
        entryFields?.name ||
        entryFields?.nama ||
        null;
      if (!entryTitle) return null;
      return (
        <blockquote
          key={index}
          className="my-6 pl-4 border-l-4 border-emerald-dalisodo/50 bg-slate-50 rounded-r-xl py-3 pr-4 italic text-slate-600 font-sans text-sm"
        >
          {entryTitle}
        </blockquote>
      );
    }
    default:
      if (node.content) {
        return <div key={index}>{renderNodeContent(node.content)}</div>;
      }
      return null;
  }
}

/**
 * Validasi dan sanitisasi URL agar aman dari bahaya XSS / tautan berbahaya.
 */
function sanitizeUri(uri?: string): string {
  if (!uri) return "#";
  const clean = uri.trim();
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:") ||
    clean.startsWith("/") ||
    clean.startsWith("#")
  ) {
    return clean;
  }
  return "#";
}

/**
 * Penyaji isi di dalam sel tabel.
 */
function renderCellContent(content: any[]): React.ReactNode {
  if (!Array.isArray(content)) return null;

  return content.map((child: any, i: number) => {
    if (child.nodeType === "paragraph") {
      return <span key={i} className="inline">{renderNodeContent(child.content)}</span>;
    }
    if (child.nodeType === "text" || child.nodeType === "hyperlink") {
      return renderNodeContent([child]);
    }
    return renderRichNode(child, i);
  });
}

/**
 * Penyaji teks inline beserta format penekanan (bold, italic, underline, code, hyperlink).
 */
function renderNodeContent(content: any[]): React.ReactNode {
  if (!Array.isArray(content)) return null;

  return content.map((child: any, i: number) => {
    if (child.nodeType === "text") {
      let textNode: React.ReactNode = child.value;

      if (child.marks && Array.isArray(child.marks)) {
        child.marks.forEach((mark: any) => {
          if (mark.type === "bold") {
            textNode = <strong key={i}>{textNode}</strong>;
          } else if (mark.type === "italic") {
            textNode = <em key={i}>{textNode}</em>;
          } else if (mark.type === "underline") {
            textNode = <u key={i}>{textNode}</u>;
          } else if (mark.type === "code") {
            textNode = <code key={i}>{textNode}</code>;
          }
        });
      }
      return <React.Fragment key={i}>{textNode}</React.Fragment>;
    } else if (child.nodeType === "hyperlink") {
      return (
        <a
          key={i}
          href={sanitizeUri(child.data?.uri)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderNodeContent(child.content)}
        </a>
      );
    } else if (child.nodeType === "asset-hyperlink") {
      // Tautan ke aset Contentful (gambar/file yang bisa diunduh)
      const assetFile = child.data?.target?.fields?.file;
      const assetHref = assetFile?.url
        ? assetFile.url.startsWith("//")
          ? `https:${assetFile.url}`
          : assetFile.url
        : null;
      const assetLinkTitle =
        child.data?.target?.fields?.title ||
        assetFile?.fileName ||
        "Unduh Aset";
      if (!assetHref) return null;
      return (
        <a
          key={i}
          href={assetHref}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {child.content && child.content.length > 0
            ? renderNodeContent(child.content)
            : assetLinkTitle}
        </a>
      );
    } else if (child.nodeType === "entry-hyperlink") {
      // Tautan ke entry Contentful lainnya
      const entryFields = child.data?.target?.fields;
      const entrySlug =
        entryFields?.slug ||
        child.data?.target?.sys?.id ||
        null;
      const entryHref = entrySlug ? `/${entrySlug}` : "#";
      return (
        <a key={i} href={entryHref}>
          {child.content && child.content.length > 0
            ? renderNodeContent(child.content)
            : entryFields?.judul || entryFields?.title || "Baca selengkapnya"}
        </a>
      );
    } else if (child.nodeType === "embedded-entry-inline") {
      // Entry inline — tampilkan judulnya sebagai badge kecil
      const inlineFields = child.data?.target?.fields;
      const inlineTitle =
        inlineFields?.judul ||
        inlineFields?.title ||
        inlineFields?.name ||
        inlineFields?.nama ||
        null;
      if (!inlineTitle) return null;
      return (
        <span
          key={i}
          className="inline-block bg-emerald-dalisodo/10 text-emerald-dalisodo text-xs font-semibold px-2 py-0.5 rounded mx-0.5 align-middle font-sans"
        >
          {inlineTitle}
        </span>
      );
    } else if (child.nodeType === "paragraph") {
      return <span key={i} className="inline">{renderNodeContent(child.content)}</span>;
    } else if (child.content) {
      return <React.Fragment key={i}>{renderNodeContent(child.content)}</React.Fragment>;
    }
    return null;
  });
}
