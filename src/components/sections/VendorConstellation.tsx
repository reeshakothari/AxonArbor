"use client";

import { m } from "framer-motion";
import { useId } from "react";

const W = 600;
const H = 540;
const CX = 300;
const CY = 272;
const RING = 196;

/** Hand-placed, deliberately uneven positions for the fragmented state. */
const SCATTERED: [number, number][] = [
  [96, 78],
  [318, 46],
  [522, 104],
  [200, 206],
  [452, 232],
  [72, 316],
  [328, 344],
  [538, 386],
  [168, 462],
  [424, 478],
];

/** Pairs of vendors that try, and fail, to connect. */
const BROKEN_LINKS: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 6],
  [3, 5],
  [4, 7],
  [5, 8],
  [6, 9],
  [6, 8],
];

const ease = [0.22, 1, 0.36, 1] as const;

function ringPosition(i: number, total: number) {
  const angle = (-90 + (360 / total) * i) * (Math.PI / 180);
  return { x: CX + RING * Math.cos(angle), y: CY + RING * Math.sin(angle), cos: Math.cos(angle), sin: Math.sin(angle) };
}

function labelOffset(label: string, size: number, resolved: boolean, cos: number, sin: number) {
  if (!resolved) return { x: 0, y: size * 2.5 };
  const halfWidth = label.length * size * 0.37;
  return { x: cos * (size * 1.7 + halfWidth * Math.abs(cos)), y: sin * size * 2.1 + size * 0.38 };
}

type Stat = { value: string; label: string };

type Props = {
  vendors: string[];
  highlighted?: number[];
  resolved: boolean;
  stat: Stat;
  resolvedStat: Stat;
  /** Label size in SVG units. Larger on phones, where the SVG is scaled down. */
  labelSize?: number;
  className?: string;
};

export function VendorConstellation({
  vendors,
  highlighted = [],
  resolved,
  stat,
  resolvedStat,
  labelSize = 10.5,
  className = "",
}: Props) {
  const descId = useId();
  const centreSize = Math.max(17, labelSize * 1.3);
  const total = vendors.length;
  const description = resolved
    ? `${total} learning services, from ${vendors.slice(0, 3).join(", ")} to ${vendors[total - 1]}, connected through one central partner, Axon Arbor.`
    : `${total} separate vendors, including ${vendors.slice(0, 3).join(", ")} and ${vendors[total - 1]}, scattered with broken, incomplete connections between them.`;

  return (
    <figure className={`relative ${className}`}>
      <div className="mb-4 border-b border-grey-200 pb-4 sm:mb-2">
        <div className="relative h-[4.5rem] sm:h-20">
          {[stat, resolvedStat].map((s, i) => {
            const visible = resolved ? i === 1 : i === 0;
            return (
              <m.p
                key={s.value}
                aria-hidden={!visible}
                className="absolute inset-0 flex items-end gap-4"
                initial={false}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : i === 0 ? -12 : 12 }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="block font-label text-5xl whitespace-nowrap leading-none font-bold tracking-tight sm:text-6xl">
                  {s.value}
                </span>
                <span className="eyebrow mb-1 block max-w-[14rem] text-[0.65rem] leading-relaxed text-grey-600">
                  {s.label}
                </span>
              </m.p>
            );
          })}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={descId}
        className="h-auto w-full overflow-visible"
      >
        <desc id={descId}>{description}</desc>

        {/* Fragmented state: links that stop short of each other. */}
        <m.g
          initial={false}
          animate={{ opacity: resolved ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          stroke="currentColor"
          strokeDasharray="3 5"
          strokeWidth="1.25"
          className="text-grey-300"
        >
          {BROKEN_LINKS.map(([a, b]) => {
            const [ax, ay] = SCATTERED[a];
            const [bx, by] = SCATTERED[b];
            const hot = highlighted.includes(a) || highlighted.includes(b);
            return (
              <g key={`${a}-${b}`} className={hot ? "text-grey-500" : undefined} stroke="currentColor">
                <line x1={ax} y1={ay} x2={ax + (bx - ax) * 0.36} y2={ay + (by - ay) * 0.36} />
                <line x1={bx} y1={by} x2={bx + (ax - bx) * 0.28} y2={by + (ay - by) * 0.28} />
              </g>
            );
          })}
        </m.g>

        {/* Connected state: one ring, spokes to the centre. */}
        <m.circle
          cx={CX}
          cy={CY}
          r={RING}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-grey-200"
          initial={false}
          animate={{ pathLength: resolved ? 1 : 0, opacity: resolved ? 1 : 0 }}
          transition={{ duration: 1.1, ease, delay: resolved ? 0.35 : 0 }}
        />
        {vendors.map((_, i) => {
          const p = ringPosition(i, total);
          const inner = 58;
          return (
            <m.line
              key={`spoke-${i}`}
              x1={CX + inner * p.cos}
              y1={CY + inner * p.sin}
              x2={CX + (RING - 10) * p.cos}
              y2={CY + (RING - 10) * p.sin}
              stroke="currentColor"
              strokeWidth="1.25"
              className="text-ink"
              initial={false}
              animate={{ pathLength: resolved ? 1 : 0, opacity: resolved ? 1 : 0 }}
              transition={{ duration: 0.7, ease, delay: resolved ? 0.5 + i * 0.04 : 0 }}
            />
          );
        })}

        <m.g
          initial={false}
          animate={{ scale: resolved ? 1 : 0, opacity: resolved ? 1 : 0 }}
          transition={{ duration: 0.8, ease, delay: resolved ? 0.2 : 0 }}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        >
          <circle cx={CX} cy={CY} r={56} className="fill-amber" />
          <text
            x={CX}
            y={CY - centreSize * 0.12}
            textAnchor="middle"
            style={{ fontSize: centreSize }}
            className="fill-ink font-serif font-semibold"
          >
            Axon
          </text>
          <text
            x={CX}
            y={CY + centreSize * 1.06}
            textAnchor="middle"
            style={{ fontSize: centreSize }}
            className="fill-ink font-serif font-semibold"
          >
            Arbor
          </text>
        </m.g>

        {vendors.map((label, i) => {
          const ring = ringPosition(i, total);
          const [sx, sy] = SCATTERED[i];
          const hot = !resolved && highlighted.includes(i);
          const offset = labelOffset(label, labelSize, resolved, ring.cos, ring.sin);
          return (
            <m.g
              key={label}
              initial={false}
              animate={{ x: resolved ? ring.x : sx, y: resolved ? ring.y : sy }}
              transition={{ duration: 1.1, ease, delay: resolved ? i * 0.03 : 0 }}
            >
              <m.circle
                r={labelSize * 0.66}
                strokeWidth="1.5"
                initial={false}
                animate={{
                  fill: hot || resolved ? "#000000" : "#ffffff",
                  stroke: hot || resolved ? "#000000" : "#9e9e9e",
                  scale: hot ? 1.35 : 1,
                }}
                transition={{ duration: 0.35 }}
              />
              <m.text
                textAnchor="middle"
                initial={false}
                animate={{ x: offset.x, y: offset.y }}
                transition={{ duration: 1.1, ease }}
                style={{ fontSize: labelSize }}
                className={`font-label font-semibold tracking-[0.12em] uppercase transition-[fill] duration-300 ${
                  hot || resolved ? "fill-ink" : "fill-grey-500"
                }`}
              >
                {label}
              </m.text>
            </m.g>
          );
        })}
      </svg>
    </figure>
  );
}
