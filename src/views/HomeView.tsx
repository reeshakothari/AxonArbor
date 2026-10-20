import { BeyondTraining } from "@/components/sections/BeyondTraining";
import { CapabilityStack } from "@/components/sections/CapabilityStack";
import { CTABand } from "@/components/sections/CTABand";
import { Hero } from "@/components/sections/Hero";
import { PillarGrid } from "@/components/sections/PillarGrid";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { PullQuote } from "@/components/sections/PullQuote";
import { Ticker } from "@/components/sections/Ticker";
import type { HomeContent, ProgrammesContent } from "@/content/types";

export function HomeView({ home, programmes }: { home: HomeContent; programmes: ProgrammesContent }) {
  return (
    <>
      <Hero {...home.hero} />
      <ProblemSection content={home.problem} />
      <PullQuote {...home.pullQuote} />
      <PillarGrid {...home.ecosystem} />
      <CapabilityStack {...home.capabilityStack} />
      <Ticker label={programmes.areas.heading} items={programmes.areas.items} />
      <BeyondTraining {...home.beyondTraining} />
      <CTABand {...home.cta} />
    </>
  );
}
