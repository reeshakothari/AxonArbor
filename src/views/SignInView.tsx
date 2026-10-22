import { JoinCards } from "@/components/accounts/Pitch";
import { SignInForm } from "@/components/accounts/AuthForms";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import type { SignInContent, SiteContent } from "@/content/types";

export function SignInView({ signIn, site }: { signIn: SignInContent; site: SiteContent }) {
  return (
    <>
      <PageHeader {...signIn.header} />
      <Container className="grid gap-16 py-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SignInForm submitLabel={signIn.button.label} />
          <p className="mt-10 max-w-md text-base text-grey-600">
            {signIn.helpText}{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-ink underline decoration-amber decoration-2 underline-offset-4"
            >
              {site.contact.email}
            </a>
          </p>
        </div>
        <div className="lg:col-span-7">
          <JoinCards />
        </div>
      </Container>
    </>
  );
}
