import type { CSSProperties } from "react";

/**
 * Full-width branch line that draws itself across the page as it scrolls
 * through the viewport (scroll-driven CSS, see `.branch-divider`).
 */
export function BranchDivider({ flip = false }: { flip?: boolean }) {
  const twigs = [120, 340, 560, 780, 1000];
  return (
    <div aria-hidden="true" className="branch-divider overflow-hidden py-6">
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        className={`h-auto w-full text-ink ${flip ? "-scale-x-100" : ""}`}
      >
        <path d="M0 40 H1200" pathLength={1} stroke="currentColor" strokeWidth="1.5" className="branch-line" />
        {twigs.map((x, i) => {
          const up = i % 2 === 0;
          return (
            <g key={x} className="branch-twig" style={{ "--i": i } as CSSProperties}>
              <path d={`M${x} 40 L${x + 24} ${up ? 16 : 64} H${x + 70}`} stroke="currentColor" strokeWidth="1.5" />
              <circle cx={x + 76} cy={up ? 16 : 64} r="6" className={i === 2 ? "fill-amber" : "fill-paper"} stroke={i === 2 ? "none" : "currentColor"} strokeWidth="1.5" />
            </g>
          );
        })}
        <circle r="5" className="fill-amber">
          <animateMotion dur="7s" repeatCount="indefinite" path="M0 40 H1200" />
        </circle>
      </svg>
    </div>
  );
}
