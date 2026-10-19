import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Staggers the reveal slightly later in the scroll range (0–1). */
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

/**
 * Fades and lifts content in as it scrolls into view, using CSS scroll-driven
 * animations (see `.reveal` in globals.css). No JavaScript; browsers without
 * support, and visitors who prefer reduced motion, simply see the content.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const style = delay ? ({ "--reveal-offset": `${Math.round(delay * 60)}%` } as CSSProperties) : undefined;
  return (
    <Tag className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
