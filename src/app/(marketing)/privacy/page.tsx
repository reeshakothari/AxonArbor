import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { LegalView } from "@/views/LegalView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("privacy"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  return <LegalView legal={await getContent("privacy")} />;
}
