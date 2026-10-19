import { Arbor } from "@/components/illustrations/Arbor";
import { Draw } from "@/components/illustrations/Draw";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { CtaContent } from "@/content/types";

export function CTABand({ heading, body, cta }: CtaContent) {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-amber text-ink">
      <Container className="grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2
            id="cta-heading"
            className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl"
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">{body}</p>
          <ButtonLink href={cta.href} variant="dark" className="mt-10">
            {cta.label}
          </ButtonLink>
        </div>
        <Draw className="hero-arbor text-ink lg:col-span-5">
          <Arbor tone="amber" className="mx-auto h-72 w-auto sm:h-96" />
        </Draw>
      </Container>
    </section>
  );
}
