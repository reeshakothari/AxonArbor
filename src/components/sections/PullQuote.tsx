"use client";

import { m } from "framer-motion";
import { Container } from "@/components/layout/Container";
import type { QuotePart } from "@/content/types";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Full-bleed typographic pull-quote. "heavy" sinks and "light" lifts as the
 * line scrolls into view, so the words act out their meaning.
 */
export function PullQuote({ parts, caption }: { parts: QuotePart[]; caption: string }) {
  return (
    <section aria-label="Pull quote" className="bg-ink text-paper">
      <Container className="py-24 sm:py-32 lg:py-44">
        <m.figure
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.6 }}
        >
          <m.span
            aria-hidden="true"
            className="block h-0.5 w-16 origin-left bg-amber"
            variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
            transition={{ duration: 0.8, ease }}
          />
          <blockquote className="mt-10 font-serif text-[clamp(2.4rem,7.4vw,7rem)] leading-[1.02] tracking-[-0.025em] text-balance">
            <p>
              {parts.map((part) =>
                part.tone ? (
                  <m.span
                    key={part.text}
                    className={`inline-block ${
                      part.tone === "heavy" ? "font-bold" : "font-normal text-grey-300 italic"
                    }`}
                    variants={{
                      hidden: { y: 0 },
                      shown: { y: part.tone === "heavy" ? "0.12em" : "-0.14em" },
                    }}
                    transition={{ duration: 1.2, ease, delay: part.tone === "heavy" ? 0.4 : 0.7 }}
                  >
                    {part.text}
                  </m.span>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </p>
          </blockquote>
          <figcaption className="eyebrow mt-12 text-grey-400">{caption}</figcaption>
        </m.figure>
      </Container>
    </section>
  );
}
