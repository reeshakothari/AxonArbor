import { Container } from "@/components/layout/Container";
import type { QuotePart } from "@/content/types";

/**
 * Full-bleed typographic pull-quote. As it scrolls into view "heavy" sinks
 * and "light" lifts, so the words act out their meaning (CSS scroll-driven
 * animation, see `.pq-*` in globals.css).
 */
export function PullQuote({ parts, caption }: { parts: QuotePart[]; caption: string }) {
  return (
    <section aria-label="Pull quote" className="pq bg-ink text-paper">
      <Container className="py-24 sm:py-32 lg:py-44">
        <figure>
          <span aria-hidden="true" className="pq-rule block h-0.5 w-16 origin-left bg-amber" />
          <blockquote className="mt-10 font-serif text-[clamp(2.4rem,7.4vw,7rem)] leading-[1.02] tracking-[-0.025em] text-balance">
            <p>
              {parts.map((part, i) =>
                part.tone ? (
                  <span
                    key={i}
                    className={`inline-block ${
                      part.tone === "heavy"
                        ? "pq-heavy font-bold"
                        : "pq-light font-serif-italic font-normal text-grey-300 italic"
                    }`}
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </p>
          </blockquote>
          <figcaption className="eyebrow mt-12 text-grey-400">{caption}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
