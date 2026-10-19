import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { PageHeaderContent } from "@/content/types";

export function PageHeader({ eyebrow, heading, lede }: PageHeaderContent) {
  return (
    <header className="border-b border-grey-200">
      <Container className="grid gap-10 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:grid-cols-12 lg:items-end lg:pt-32">
        <div className="lg:col-span-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-[-0.02em] text-balance sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
        </div>
        {lede && (
          <p className="text-lg leading-relaxed text-grey-600 lg:col-span-4 lg:pb-2">
            {lede}
          </p>
        )}
      </Container>
    </header>
  );
}
