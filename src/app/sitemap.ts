import type { MetadataRoute } from "next";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { home } from "@/content/home";
import { hospitality } from "@/content/hospitality";
import { programmes } from "@/content/programmes";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [home, programmes, hospitality, about, contact].map(({ meta }) => ({
    url: new URL(meta.path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority: meta.path === "/" ? 1 : 0.8,
  }));
}
