import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { ContactView } from "@/views/ContactView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("contact"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  const [contact, site] = await Promise.all([getContent("contact"), getContent("site")]);
  return <ContactView contact={contact} site={site} />;
}
