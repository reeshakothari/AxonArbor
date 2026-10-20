import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { AboutView } from "@/views/AboutView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("about"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  
  return <AboutView about={await getContent("about")} />;
}
