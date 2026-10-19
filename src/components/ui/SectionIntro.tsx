import type { SectionIntro as SectionIntroContent } from "@/content/types";
import { Eyebrow } from "./Eyebrow";

type Props = SectionIntroContent & {
  id?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionIntro({
  eyebrow,
  heading,
  lede,
  id,
  as: Heading = "h2",
  tone = "light",
  className = "",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={`mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {heading}
      </Heading>
      {lede && (
        <p
          className={`mt-6 max-w-2xl text-lg leading-relaxed text-pretty ${
            dark ? "text-grey-300" : "text-grey-600"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
