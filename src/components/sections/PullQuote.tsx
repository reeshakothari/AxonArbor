import { Balance } from "@/components/illustrations/Balance";
import { Container } from "@/components/layout/Container";
import type { QuotePart } from "@/content/types";

/**
 * Full-bleed pull-quote with a see-saw illustration. As it scrolls into view
 * "heavy" sinks, "light" lifts and the beam tips under the weight of
 * operations (CSS scroll-driven animation, see `.pq-*` and `.balance-*`).
 */
export function PullQuote({ parts, caption }: { parts: QuotePart[]; caption: string }) {
  const heavy = parts.find((p) => p.tone === "heavy")?.text ?? "heavy";
  const light = parts.find((p) => p.tone === "light")?.text.replace(/\.$/, "") ?? "light";
  return (
    <section aria-label="Pull quote" className="pq relative overflow-hidden bg-ink text-paper">
      <Container className="grid items-center gap-16 py-24 sm:py-32 lg:grid-cols-12 lg:py-40">
        <figure className="lg:col-span-7">
          <span aria-hidden="true" className="pq-rule block h-0.5 w-16 origin-left bg-amber" />
          <blockquote className="mt-10 font-serif text-[clamp(2.4rem,6.2vw,6rem)] leading-[1.02] tracking-[-0.025em] text-balance">
            <p>
              {parts.map((part) =>
                part.tone ? (
                  <span
                    key={part.text}
                    className={`inline-block ${
                      part.tone === "heavy"
                        ? "pq-heavy font-bold"
                        : "pq-light font-serif-italic font-normal text-grey-300 italic"
                    }`}
                  >
                    {part.text}
                  </span>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </p>
          </blockquote>
          <figcaption className="eyebrow mt-12 text-grey-400">{caption}</figcaption>
        </figure>
        <div className="lg:col-span-5">
          <Balance
            heavyLabel={`Operationally ${heavy}`}
            lightLabel={`Strategically ${light}`}
            className="mx-auto w-full max-w-lg"
          />
        </div>
      </Container>
    </section>
  );
}
