import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { signIn } from "@/content/contact";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(signIn.meta);

export default function SignInPage() {
  return (
    <>
      <PageHeader {...signIn.header} />
      <Container className="flex flex-wrap items-center gap-8 py-16 sm:py-20">
        <ButtonLink href="/">Back to home</ButtonLink>
        <p className="text-grey-600">
          Need access sooner? Email{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-ink underline decoration-amber decoration-2 underline-offset-4"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </Container>
    </>
  );
}
