import type { MetadataRoute } from "next";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { home } from "@/content/home";
import { privacy, terms } from "@/content/legal";
import { hospitality } from "@/content/hospitality";
import { programmes } from "@/content/programmes";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [home, programmes, hospitality, about, contact].map(({ meta }) => ({
    url: new URL(meta.path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: meta.path === "/" ? 1 : 0.8,
  }));
  const legal = [privacy, terms].map(({ meta }) => ({
    url: new URL(meta.path, siteUrl).toString(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));
  return [...pages, ...legal];
}
