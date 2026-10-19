import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { Item, SectionIntro as SectionIntroContent } from "@/content/types";

type Props = SectionIntroContent & { pillars: Item[] };

export function PillarGrid({ eyebrow, heading, lede, pillars }: Props) {
  return (
    <section aria-labelledby="ecosystem-heading" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionIntro id="ecosystem-heading" eyebrow={eyebrow} heading={heading} lede={lede} />
        </Reveal>
        <ol className="mt-16 grid border-t border-ink sm:mt-20 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal
              as="li"
              key={pillar.title}
              delay={i * 0.12}
              className="border-b border-grey-200 py-10 lg:border-b-0 lg:py-12 lg:pr-10 lg:not-first:border-l lg:not-first:pl-10"
            >
              <p className="flex items-center gap-3 font-label text-xs font-semibold tracking-[0.18em] text-grey-600">
                <span aria-hidden="true" className="size-2 bg-amber" />
                0{i + 1}
              </p>
              <h3 className="mt-8 font-serif text-3xl tracking-tight">{pillar.title}</h3>
              <p className="mt-4 leading-relaxed text-grey-600">{pillar.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
