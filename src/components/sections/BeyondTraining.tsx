import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { LinkedItem, SectionIntro as SectionIntroContent } from "@/content/types";

type Props = SectionIntroContent & { items: LinkedItem[] };

function RowArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="size-7 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  );
}

export function BeyondTraining({ eyebrow, heading, lede, items }: Props) {
  return (
    <section aria-labelledby="beyond-heading" className="py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionIntro id="beyond-heading" eyebrow={eyebrow} heading={heading} lede={lede} />
        </Reveal>
        <ul className="border-t border-ink lg:col-span-8">
          {items.map((item, i) => {
            const body = (
              <>
                <span className="font-label text-xs font-semibold tracking-[0.18em] text-grey-500">
                  0{i + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-serif text-3xl tracking-tight sm:text-4xl">
                    {item.title}
                  </span>
                  <span className="mt-3 block max-w-lg leading-relaxed text-grey-600">
                    {item.body}
                  </span>
                </span>
                {item.href && <RowArrow />}
              </>
            );
            const row = "group flex items-start gap-6 border-b border-grey-200 py-9 sm:gap-10";
            return (
              <Reveal as="li" key={item.title} delay={i * 0.1}>
                {item.href ? (
                  <Link href={item.href} className={`${row} transition-colors hover:bg-grey-50`}>
                    {body}
                  </Link>
                ) : (
                  <div className={row}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
