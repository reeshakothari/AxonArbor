import { CapabilityRing } from "@/components/illustrations/CapabilityRing";
import { Draw } from "@/components/illustrations/Draw";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CapabilityColumn, SectionIntro as SectionIntroContent } from "@/content/types";

type Props = SectionIntroContent & { columns: CapabilityColumn[] };

export function CapabilityStack({ eyebrow, heading, lede, columns }: Props) {
  return (
    <section
      aria-labelledby="capability-heading"
      className="stack border-t border-grey-200 bg-grey-50 py-24 sm:py-32"
    >
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionIntro id="capability-heading" eyebrow={eyebrow} heading={heading} lede={lede} />
          </Reveal>
          <Draw className="hidden shrink-0 lg:block">
            <CapabilityRing count={columns.length} className="size-56" />
          </Draw>
        </div>

        <div className="mt-16 grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, i) => (
            <Reveal
              key={column.title}
              delay={i * 0.08}
              className="group relative bg-paper"
            >
              <div data-col={i} className="h-full p-8 lg:p-9">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-amber transition-transform duration-500 group-hover:scale-x-100"
                />
                <p className="font-label text-xs font-semibold tracking-[0.18em] text-grey-500">
                  0{i + 1}
                </p>
                <h3 className="mt-4 font-serif text-2xl leading-tight sm:min-h-[2.5em]">
                  {column.title}
                </h3>
                <ul className="mt-6 space-y-3 border-t border-grey-200 pt-6">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-grey-700">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-grey-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
