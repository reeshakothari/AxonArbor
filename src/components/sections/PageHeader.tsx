import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { PageHeaderContent } from "@/content/types";

type Props = PageHeaderContent & {
  /** Optional animated illustration shown beside the heading. */
  illustration?: ReactNode;
};

export function PageHeader({ eyebrow, heading, lede, illustration }: Props) {
  return (
    <header className="relative overflow-hidden border-b border-grey-200">
      {illustration && (
        <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      )}
      <Container
        className={`relative grid gap-10 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:grid-cols-12 lg:pt-28 ${
          illustration ? "lg:items-center" : "lg:items-end lg:pt-32"
        }`}
      >
        <div className={illustration ? "lg:col-span-6" : "lg:col-span-8"}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="hero-word mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-balance sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          {illustration && lede && (
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-grey-600">{lede}</p>
          )}
        </div>
        {illustration ? (
          <div className="lg:col-span-6">{illustration}</div>
        ) : (
          lede && <p className="text-lg leading-relaxed text-grey-600 lg:col-span-4 lg:pb-2">{lede}</p>
        )}
      </Container>
    </header>
  );
}
