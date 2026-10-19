import type { CSSProperties } from "react";

type Branch = { d: string; route: string; node: [number, number]; accent?: boolean; delay: number };

/**
 * Abstract "arbor": a circuit-like tree of learning paths with roots. Drawn
 * from the trunk outwards; amber "signals" then travel from the roots to the
 * tips, and an orbit turns slowly around the canopy.
 */
const TRUNK = "M160 352 V52";
const BRANCHES: Branch[] = [
  { d: TRUNK, route: "M160 352 V52", node: [160, 42], accent: true, delay: 150 },
  { d: "M160 300 L112 252 V176 L78 142", route: "M160 352 V300 L112 252 V176 L78 142", node: [71, 135], delay: 450 },
  { d: "M160 300 L208 252 V176 L242 142", route: "M160 352 V300 L208 252 V176 L242 142", node: [249, 135], accent: true, delay: 450 },
  { d: "M112 222 H66 L42 198", route: "M160 352 V300 L112 252 V222 H66 L42 198", node: [35, 191], delay: 800 },
  { d: "M208 222 H254 L278 198", route: "M160 352 V300 L208 252 V222 H254 L278 198", node: [285, 191], delay: 800 },
  { d: "M112 252 H74 L50 276", route: "M160 352 V300 L112 252 H74 L50 276", node: [43, 283], accent: true, delay: 900 },
  { d: "M208 252 H246 L270 276", route: "M160 352 V300 L208 252 H246 L270 276", node: [277, 283], delay: 900 },
  { d: "M160 210 L130 180 V104 L106 80", route: "M160 352 V210 L130 180 V104 L106 80", node: [99, 73], delay: 700 },
  { d: "M160 210 L190 180 V104 L214 80", route: "M160 352 V210 L190 180 V104 L214 80", node: [221, 73], accent: true, delay: 700 },
  { d: "M160 124 L140 104", route: "M160 352 V124 L140 104", node: [133, 97], delay: 1000 },
  { d: "M160 124 L180 104", route: "M160 352 V124 L180 104", node: [187, 97], delay: 1000 },
];

const ROOTS = [
  { d: "M60 352 H260", delay: 0 },
  { d: "M160 352 L132 380 H98", node: [91, 380] as [number, number], delay: 250 },
  { d: "M160 352 L188 380 H222", node: [229, 380] as [number, number], delay: 250 },
  { d: "M160 352 V404", node: [160, 411] as [number, number], delay: 350 },
];

const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

type ArborProps = {
  className?: string;
  /** "light" for white backgrounds, "amber" for the amber band. */
  tone?: "light" | "amber";
  /** Amber signals travelling along the branches. */
  pulses?: boolean;
  /** Slowly rotating dashed orbit around the canopy. */
  orbit?: boolean;
};

export function Arbor({ className = "", tone = "light", pulses = true, orbit = true }: ArborProps) {
  const accentFill = tone === "amber" ? "fill-ink" : "fill-amber";
  const nodeFill = tone === "amber" ? "fill-amber" : "fill-paper";
  const signalFill = tone === "amber" ? "fill-paper" : "fill-amber";

  return (
    <svg viewBox="-10 -10 340 440" fill="none" className={`overflow-visible ${className}`}>
      {orbit && (
        <g className="orbit-in">
          <circle
            cx="160"
            cy="180"
            r="168"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 10"
            className="spin-slow opacity-40"
            style={{ transformOrigin: "160px 180px" }}
          />
          <circle
            cx="160"
            cy="180"
            r="196"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1 18"
            className="spin-slow-reverse opacity-25"
            style={{ transformOrigin: "160px 180px" }}
          />
          <circle cx="328" cy="180" r="4" className={`${accentFill} spin-slow`} style={{ transformOrigin: "160px 180px" }} />
        </g>
      )}

      <g stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        {[...ROOTS, ...BRANCHES].map((b) => (
          <path key={b.d} d={b.d} pathLength={1} data-stroke style={delay(b.delay)} />
        ))}
      </g>

      {pulses &&
        BRANCHES.map((b, i) => (
          <circle key={`pulse-${i}`} r="4.5" className={`signal ${signalFill}`} opacity="0">
            <animateMotion
              dur={`${2.6 + (i % 4) * 0.45}s`}
              begin={`${2.2 + i * 0.55}s`}
              repeatCount="indefinite"
              path={b.route}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.85;1"
              dur={`${2.6 + (i % 4) * 0.45}s`}
              begin={`${2.2 + i * 0.55}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {ROOTS.filter((r) => r.node).map(({ node, delay: ms }) => (
        <circle
          key={`root-${node![0]}-${node![1]}`}
          cx={node![0]}
          cy={node![1]}
          r={4}
          data-node
          style={delay(ms + 700)}
          className={`${nodeFill} stroke-current`}
          strokeWidth="2"
        />
      ))}

      {BRANCHES.map(({ node, accent, delay: ms }) => {
        const [cx, cy] = node;
        return accent ? (
          <g key={`${cx}-${cy}`} data-node style={delay(ms + 900)}>
            <circle cx={cx} cy={cy} r={9} className={`${accentFill} breathe`} />
          </g>
        ) : (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={6.5}
            data-node
            style={delay(ms + 900)}
            className={`${nodeFill} stroke-current`}
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
