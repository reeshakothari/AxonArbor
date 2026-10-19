import type { CSSProperties } from "react";

const C = 100;
const R = 78;
const GAP = 5; // degrees between arcs

function point(angle: number, radius = R) {
  const a = (angle * Math.PI) / 180;
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)].map((n) => +n.toFixed(2));
}

/**
 * The 360 stack as a ring of four arcs, one per capability column. Hovering a
 * column highlights its arc (pure CSS via :has, see `.stack` in globals.css).
 */
export function CapabilityRing({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const span = 360 / count;
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      <circle
        cx={C}
        cy={C}
        r={R + 30}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1 7"
        className="spin-slow-reverse text-grey-400"
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <g className="spin-slow" style={{ transformOrigin: `${C}px ${C}px` }}>
        {Array.from({ length: count }, (_, i) => {
          const start = -90 + i * span + GAP;
          const end = -90 + (i + 1) * span - GAP;
          const [x1, y1] = point(start);
          const [x2, y2] = point(end);
          const [lx, ly] = point((start + end) / 2, R + 17);
          return (
            <g key={i}>
              <path
                d={`M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}`}
                pathLength={1}
                data-stroke
                data-arc={i}
                style={{ "--d": i * 220 } as CSSProperties}
                className="stack-arc stroke-ink"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x={lx}
                y={ly + 3}
                textAnchor="middle"
                className="fill-grey-500 font-label text-[9px] font-semibold tracking-[0.15em]"
              >
                0{i + 1}
              </text>
            </g>
          );
        })}
      </g>
      <circle
        cx={C}
        cy={C}
        r={34}
        className="ping fill-amber"
        style={{ transformOrigin: `${C}px ${C}px` }}
      />
      <text
        x={C}
        y={C + 6}
        textAnchor="middle"
        className="fill-ink font-label text-[34px] font-bold tracking-tight"
      >
        360
      </text>
      <text
        x={C}
        y={C + 24}
        textAnchor="middle"
        className="fill-grey-500 font-label text-[7px] font-semibold tracking-[0.2em] uppercase"
      >
        Capability
      </text>
    </svg>
  );
}
