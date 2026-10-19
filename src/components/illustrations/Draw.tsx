"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DrawProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the element that must be visible before it draws. */
  threshold?: number;
};

/**
 * Marks its line illustrations as drawn the first time they scroll into view.
 * The animation itself is CSS (see `.draw` in globals.css): strokes tagged
 * `data-stroke` draw on, nodes tagged `data-node` pop in.
 */
export function Draw({ children, className = "", threshold = 0.35 }: DrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} aria-hidden="true" data-drawn={drawn} className={`draw ${className}`}>
      {children}
    </div>
  );
}
