import { LegacyIllustration } from "@/components/illustrations/Legacy";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { HeroContent } from "@/content/types";

export function Hero({ eyebrow, heading, lede, primaryCta, secondaryCta }: HeroContent) {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b border-grey-200">
      {/* Faint dot grid that drifts slowly behind the hero. */}
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-60" />

      <Container className="relative grid items-center gap-12 pt-14 pb-16 sm:pt-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:gap-6 lg:py-10">
        <div className="lg:col-span-7">
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(3.25rem,7.4vw,6.5rem)] leading-[0.95] tracking-[-0.03em]"
          >
            {eyebrow.map((word, i) => (
              <span
                key={word}
                className="hero-word flex items-baseline gap-[0.18em]"
                style={{ animationDelay: `${i * 140}ms` }}
              >
                <span className={i === eyebrow.length - 1 ? "font-serif-italic italic" : undefined}>
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

          <p
            aria-hidden="true"
            className="mt-8 max-w-xl font-serif text-2xl leading-snug text-balance sm:text-3xl"
          >
            {heading}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-grey-600 sm:text-lg">{lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="text" arrow={false}>
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <LegacyIllustration scene="coffee-date" eager className="mx-auto w-full max-w-xl lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}
