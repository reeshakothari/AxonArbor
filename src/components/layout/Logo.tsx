import Image from "next/image";
import Link from "next/link";
import type { ImageAsset } from "@/content/types";

type LogoProps = {
  logo: ImageAsset;
  name: string;
  /** "light" for white backgrounds, "dark" for black. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The brand mark is used unaltered. The default file has generous built-in
 * padding, so the frame crops into it with CSS only.
 */
export function LogoMark({ logo, size = 44 }: { logo: ImageAsset; size?: number }) {
  if (!logo.src) return null;
  return (
    <span className="relative block shrink-0 overflow-hidden" style={{ width: size, height: size }}>
      <Image
        src={logo.src}
        alt=""
        width={logo.width || 690}
        height={logo.height || 615}
        sizes={`${Math.round(size * 1.6)}px`}
        loading="eager"
        className="absolute inset-0 h-full w-full origin-[50%_46%] scale-[1.55] object-cover"
      />
    </span>
  );
}

export function Logo({ logo, name, tone = "light", className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${name} home`}
    >
      <LogoMark logo={logo} />
      <span
        className={`font-serif text-xl leading-none font-semibold tracking-tight ${
          tone === "dark" ? "text-paper" : "text-ink"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}
