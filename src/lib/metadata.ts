import type { Metadata } from "next";
import type { PageMeta } from "@/content/types";

/** Builds per-page metadata, including Open Graph and canonical URL. */
export function pageMetadata({ title, description, path }: PageMeta, siteName: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName,
      url: path,
      title: `${title} | ${siteName}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}
