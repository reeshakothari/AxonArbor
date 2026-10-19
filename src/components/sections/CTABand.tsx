import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { CtaContent } from "@/content/types";

export function CTABand({ heading, body, cta }: CtaContent) {
  return (
    <section aria-labelledby="cta-heading" className="bg-amber text-ink">
      <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2
            id="cta-heading"
            className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl"
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{body}</p>
        </div>
        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <ButtonLink href={cta.href} variant="dark">
            {cta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
