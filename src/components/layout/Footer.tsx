import Link from "next/link";
import { mainNav, signInLink, site } from "@/content/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Logo tone="dark" />
          <p className="eyebrow mt-6 text-grey-300">{site.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-grey-300">
            One partner for the complete learning ecosystem, from diagnosis to
            delivery to culture.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <h2 className="eyebrow text-grey-400">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[...mainNav, signInLink].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-grey-200 transition-colors hover:text-amber"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="eyebrow text-grey-400">Get in touch</h2>
          <address className="mt-5 space-y-4 text-sm leading-relaxed text-grey-200 not-italic">
            <p>
              {site.contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p>
              <a
                href={`mailto:${site.contact.email}`}
                className="underline decoration-grey-600 underline-offset-4 transition-colors hover:text-amber hover:decoration-amber"
              >
                {site.contact.email}
              </a>
            </p>
            <p>
              <a
                href={site.contact.phoneHref}
                className="transition-colors hover:text-amber"
              >
                {site.contact.phone}
              </a>
            </p>
          </address>
        </div>
      </Container>
      <div className="border-t border-grey-800">
        <Container className="flex flex-col gap-2 py-6 text-xs text-grey-400 sm:flex-row sm:justify-between">
          <p>{site.copyright}</p>
          <p>Noida, India</p>
        </Container>
      </div>
    </footer>
  );
}
