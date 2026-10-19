import type { CSSProperties } from "react";

type Branch = { d: string; node?: [number, number]; accent?: boolean; delay: number };

/**
 * Abstract "arbor": a circuit-like tree of learning paths. Drawn from the
 * trunk outwards; a few nodes are amber and breathe gently once drawn.
 */
const BRANCHES: Branch[] = [
  { d: "M96 352 H224", delay: 0 },
  { d: "M160 352 V52", node: [160, 42], accent: true, delay: 150 },
  { d: "M160 300 L112 252 V176 L78 142", node: [71, 135], delay: 450 },
  { d: "M160 300 L208 252 V176 L242 142", node: [249, 135], accent: true, delay: 450 },
  { d: "M112 222 H66 L42 198", node: [35, 191], delay: 800 },
  { d: "M208 222 H254 L278 198", node: [285, 191], delay: 800 },
  { d: "M112 252 H74 L50 276", node: [43, 283], accent: true, delay: 900 },
  { d: "M208 252 H246 L270 276", node: [277, 283], delay: 900 },
  { d: "M160 210 L130 180 V104 L106 80", node: [99, 73], delay: 700 },
  { d: "M160 210 L190 180 V104 L214 80", node: [221, 73], delay: 700 },
  { d: "M160 124 L140 104", node: [133, 97], delay: 1000 },
  { d: "M160 124 L180 104", node: [187, 97], delay: 1000 },
];

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export function Arbor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 360" fill="none" className={className}>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {BRANCHES.map((b) => (
          <path key={b.d} d={b.d} pathLength={1} data-stroke style={delay(b.delay)} />
        ))}
      </g>
      {BRANCHES.filter((b) => b.node).map(({ node, accent, delay: ms }) => {
        const [cx, cy] = node!;
        return accent ? (
          <g key={`${cx}-${cy}`} data-node style={delay(ms + 900)}>
            <circle cx={cx} cy={cy} r={7} className="fill-amber breathe" />
          </g>
        ) : (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={5.5}
            data-node
            style={delay(ms + 900)}
            className="fill-paper stroke-current"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}
