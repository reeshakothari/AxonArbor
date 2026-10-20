import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import type { ContactContent, SiteContent } from "@/content/types";

export function ContactView({ contact, site }: { contact: ContactContent; site: SiteContent }) {
  const { details } = contact;
  return (
    <>
      <PageHeader {...contact.header} />
      <section aria-label="Contact form and details" className="py-16 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <ContactForm {...contact.form} />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink pt-8">
              <h2 className="eyebrow text-grey-600">{details.visitHeading}</h2>
              <address className="mt-4 font-serif text-2xl leading-snug not-italic">
                {site.legalName}
                {site.contact.address.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div className="mt-10 border-t border-grey-200 pt-8">
              <h2 className="eyebrow text-grey-600">{details.emailHeading}</h2>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-4 inline-block font-serif text-2xl underline decoration-amber decoration-2 underline-offset-[6px] hover:decoration-ink"
              >
                {site.contact.email}
              </a>
            </div>
            <div className="mt-10 border-t border-grey-200 pt-8">
              <h2 className="eyebrow text-grey-600">{details.callHeading}</h2>
              <a href={site.contact.phoneHref} className="mt-4 inline-block font-serif text-2xl hover:underline">
                {site.contact.phone}
              </a>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
