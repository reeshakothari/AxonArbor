import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { PullQuote } from "@/components/sections/PullQuote";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: { absolute: `Axon Arbor | ${home.meta.title}` },
  description: home.meta.description,
  alternates: { canonical: home.meta.path },
};

export default function HomePage() {
  return (
    <>
      <Hero {...home.hero} />
      <ProblemSection content={home.problem} />
      <PullQuote {...home.pullQuote} />
    </>
  );
}
