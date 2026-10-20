import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { PageHeader } from "@/components/sections/PageHeader";
import type { HospitalityContent } from "@/content/types";

export function HospitalityView({ hospitality }: { hospitality: HospitalityContent }) {
  const { header, intro, segments, specialismsLabel, cta } = hospitality;
  return (
    <>
      <PageHeader {...header} />

      <section aria-label="Why training matters in hospitality" className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          {intro.map((p, i) => (
            <Reveal key={i} delay={i * 0.1} className={i === 0 ? "lg:col-span-6" : "lg:col-span-5 lg:col-start-8"}>
              <p
                className={
                  i === 0 ? "font-serif text-3xl leading-snug text-pretty" : "text-lg leading-relaxed text-grey-600"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <div className="border-t border-grey-200">
        {segments.map((segment, i) => {
          const flip = i % 2 === 1;
          const headingId = `segment-${i}-heading`;
          return (
            <section
              key={i}
              id={segment.id || undefined}
              aria-labelledby={headingId}
              className="scroll-mt-20 border-b border-grey-200 py-20 sm:py-24"
            >
              <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                {segment.image?.src && (
                  <Reveal className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                    <div className="img-reveal relative aspect-[4/5] overflow-hidden bg-grey-100">
                      <Image
                        src={segment.image.src}
                        alt={segment.image.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover grayscale"
                      />
                    </div>
                  </Reveal>
                )}
                <Reveal delay={0.1} className={`lg:col-span-6 ${flip ? "lg:order-1" : "lg:col-start-7"}`}>
                  <p className="font-label text-xs font-semibold tracking-[0.18em] text-grey-500">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 id={headingId} className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                    {segment.title}
                  </h2>
                  <div className="mt-6 space-y-4 text-lg leading-relaxed text-grey-700">
                    {segment.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                  {segment.specialisms.length > 0 && (
                    <div className="mt-8 border-t border-grey-200 pt-6">
                      <p className="eyebrow text-grey-500">{specialismsLabel}</p>
                      <ul className="mt-4 space-y-2.5">
                        {segment.specialisms.map((s, j) => (
                          <li key={j} className="flex gap-3 text-grey-800">
                            <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-amber" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              </Container>
            </section>
          );
        })}
      </div>

      <CTABand {...cta} />
    </>
  );
}
