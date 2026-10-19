import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

type LogoProps = {
  /** "light" for white backgrounds, "dark" for black. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The brand mark is used unaltered from /public/brand/logo.png. The file has
 * generous built-in padding, so the frame crops into it with CSS only.
 */
export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={site.logo.src}
        alt=""
        width={site.logo.width}
        height={site.logo.height}
        sizes={`${Math.round(size * 1.6)}px`}
        priority
        className="absolute inset-0 h-full w-full origin-[50%_46%] scale-[1.55] object-cover"
      />
    </span>
  );
}

export function Logo({ tone = "light", className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} home`}
    >
      <LogoMark />
      <span
        className={`font-serif text-xl leading-none font-semibold tracking-tight ${
          tone === "dark" ? "text-paper" : "text-ink"
        }`}
      >
        Axon Arbor
      </span>
    </Link>
  );
}
