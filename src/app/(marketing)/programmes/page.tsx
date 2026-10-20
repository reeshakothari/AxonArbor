import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { ProgrammesView } from "@/views/ProgrammesView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("programmes"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  
  return <ProgrammesView programmes={await getContent("programmes")} />;
}
