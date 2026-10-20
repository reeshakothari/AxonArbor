import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { HomeView } from "@/views/HomeView";

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getContent("home"), getContent("site")]);
  return {
    title: { absolute: `${site.name} | ${home.meta.title}` },
    description: home.meta.description,
    alternates: { canonical: home.meta.path },
  };
}

export default async function HomePage() {
  const [home, programmes] = await Promise.all([getContent("home"), getContent("programmes")]);
  return <HomeView home={home} programmes={programmes} />;
}
