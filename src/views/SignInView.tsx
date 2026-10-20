import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import type { SignInContent, SiteContent } from "@/content/types";

export function SignInView({ signIn, site }: { signIn: SignInContent; site: SiteContent }) {
  return (
    <>
      <PageHeader {...signIn.header} />
      <Container className="flex flex-wrap items-center gap-8 py-16 sm:py-20">
        <ButtonLink href={signIn.button.href}>{signIn.button.label}</ButtonLink>
        <p className="text-grey-600">
          {signIn.helpText}{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-ink underline decoration-amber decoration-2 underline-offset-4"
          >
            {site.contact.email}
          </a>
        </p>
      </Container>
    </>
  );
}
