import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { HospitalityView } from "@/views/HospitalityView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("hospitality"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  
  return <HospitalityView hospitality={await getContent("hospitality")} />;
}
