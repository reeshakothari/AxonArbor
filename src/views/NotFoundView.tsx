import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SiteContent } from "@/content/types";

export function NotFoundView({ site }: { site: SiteContent }) {
  const { notFound } = site;
  return (
    <Container className="py-28 sm:py-40">
      <Eyebrow>{notFound.eyebrow}</Eyebrow>
      <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
        {notFound.heading}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-grey-600">{notFound.body}</p>
      <ButtonLink href={notFound.button.href} className="mt-10">
        {notFound.button.label}
      </ButtonLink>
    </Container>
  );
}
