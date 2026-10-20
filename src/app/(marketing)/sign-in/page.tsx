import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { SignInView } from "@/views/SignInView";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getContent("sign-in"), getContent("site")]);
  return pageMetadata(page.meta, site.name);
}

export default async function Page() {
  const [signIn, site] = await Promise.all([getContent("sign-in"), getContent("site")]);
  return <SignInView signIn={signIn} site={site} />;
}
