import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { HeroContent } from "@/content/types";

export function Hero({ eyebrow, heading, lede, primaryCta, secondaryCta }: HeroContent) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative border-b border-grey-200"
    >
      <Container className="grid min-h-[calc(100svh-4rem)] content-between gap-16 pt-16 pb-12 sm:pt-24 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:gap-8 lg:pt-28 lg:pb-16">
        <h1
          id="hero-heading"
          className="font-serif text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.95] tracking-[-0.03em] lg:col-span-8"
        >
          {eyebrow.map((word, i) => (
            <span key={word} className="flex items-baseline gap-[0.18em]">
              <span className={i === eyebrow.length - 1 ? "italic" : undefined}>
                {word}
              </span>
              <span
                aria-hidden="true"
                className="hero-dot inline-block size-[0.14em] shrink-0 rounded-full bg-amber"
                style={{ animationDelay: `${300 + i * 180}ms` }}
              />
            </span>
          ))}
          <span className="sr-only"> | {heading}</span>
        </h1>

        <div className="flex flex-col justify-end lg:col-span-4 lg:pb-3">
          <p aria-hidden="true" className="font-serif text-2xl leading-snug text-balance sm:text-3xl">
            {heading}
          </p>
          <p className="mt-5 text-base leading-relaxed text-grey-600 sm:text-lg">
            {lede}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="text" arrow={false}>
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
