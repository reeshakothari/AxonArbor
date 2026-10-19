import type { Metadata } from "next";
import { BeyondTraining } from "@/components/sections/BeyondTraining";
import { CapabilityStack } from "@/components/sections/CapabilityStack";
import { CTABand } from "@/components/sections/CTABand";
import { Hero } from "@/components/sections/Hero";
import { PillarGrid } from "@/components/sections/PillarGrid";
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
      <PillarGrid {...home.ecosystem} />
      <CapabilityStack {...home.capabilityStack} />
      <BeyondTraining {...home.beyondTraining} />
      <CTABand {...home.cta} />
    </>
  );
}
