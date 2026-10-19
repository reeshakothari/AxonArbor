import type { Metadata } from "next";
import { site } from "@/content/site";
import type { PageMeta } from "@/content/types";

/** Builds per-page metadata, including Open Graph and canonical URL. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: site.name,
      url: path,
      title: `${title} | ${site.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}
