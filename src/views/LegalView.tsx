import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import type { LegalContent } from "@/content/types";

export function LegalView({ legal }: { legal: LegalContent }) {
  return (
    <>
      <PageHeader {...legal.header} />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-grey-600">Last updated</p>
            <p className="mt-2 font-serif text-xl">{legal.updated}</p>
            <nav aria-label="On this page" className="mt-10 hidden lg:block">
              <p className="eyebrow text-grey-600">On this page</p>
              <ol className="mt-4 space-y-2 text-sm">
                {legal.sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#section-${i + 1}`} className="text-grey-600 transition-colors hover:text-ink">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>
        <article className="max-w-3xl lg:col-span-8 lg:col-start-5">
          <div className="space-y-5 text-lg leading-relaxed text-grey-700">
            {legal.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {legal.sections.map((s, i) => (
            <section key={i} id={`section-${i + 1}`} className="mt-12 scroll-mt-28 border-t border-grey-200 pt-10">
              <h2 className="font-serif text-3xl tracking-tight">{s.heading}</h2>
              {s.paragraphs.length > 0 && (
                <div className="mt-5 space-y-4 leading-relaxed text-grey-700">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              )}
              {s.points.length > 0 && (
                <ul className="mt-5 space-y-3 leading-relaxed text-grey-700">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-amber" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Container>
    </>
  );
}
