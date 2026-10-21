import type { CSSProperties, ReactNode } from "react";
import type { IconName } from "@/content/types";

/**
 * Line icons in the site's illustration style: 1.5px strokes that draw on
 * (data-stroke), white nodes and a single amber accent (data-node). Wrap in
 * <Draw> to animate.
 */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function Node({ cx, cy, r = 4, ms = 0 }: { cx: number; cy: number; r?: number; ms?: number }) {
  return <circle cx={cx} cy={cy} r={r} data-node style={d(ms)} className="fill-paper" />;
}

function Accent({ cx, cy, r = 4.5, ms = 0 }: { cx: number; cy: number; r?: number; ms?: number }) {
  return <circle cx={cx} cy={cy} r={r} data-node style={d(ms)} className="fill-amber" stroke="none" />;
}

/** Many inputs converging into one partner. */
export function OneStopIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 14 L28 32" pathLength={1} data-stroke style={d(0)} />
      <path d="M6 32 H28" pathLength={1} data-stroke style={d(100)} />
      <path d="M8 50 L28 32" pathLength={1} data-stroke style={d(200)} />
      <circle cx="39" cy="32" r="11" pathLength={1} data-stroke style={d(450)} />
      <path d="M50 32 H58" pathLength={1} data-stroke style={d(800)} />
      <Node cx={8} cy={14} r={3} ms={500} />
      <Node cx={6} cy={32} r={3} ms={550} />
      <Node cx={8} cy={50} r={3} ms={600} />
      <Accent cx={39} cy={32} ms={900} />
    </Icon>
  );
}

/** Diverse inputs shaped into one tailored path. */
export function TailoredIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 12 C 28 12, 30 32, 50 32" pathLength={1} data-stroke style={d(0)} />
      <path d="M6 32 H50" pathLength={1} data-stroke style={d(150)} />
      <path d="M12 52 C 28 52, 30 32, 50 32" pathLength={1} data-stroke style={d(300)} />
      <Node cx={8} cy={12} r={3} ms={500} />
      <Node cx={6} cy={32} r={3} ms={550} />
      <Node cx={12} cy={52} r={3} ms={600} />
      <Accent cx={55} cy={32} ms={850} />
    </Icon>
  );
}

/** Specialists gathered around a brief. */
export function ExpertsIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M32 32 V12" pathLength={1} data-stroke style={d(0)} />
      <path d="M32 32 L13 45" pathLength={1} data-stroke style={d(150)} />
      <path d="M32 32 L51 45" pathLength={1} data-stroke style={d(300)} />
      <circle cx="32" cy="32" r="20" pathLength={1} data-stroke style={d(400)} opacity="0.25" />
      <Node cx={32} cy={10} r={5} ms={500} />
      <Node cx={12} cy={46} r={5} ms={600} />
      <Node cx={52} cy={46} r={5} ms={700} />
      <Accent cx={32} cy={32} ms={850} />
    </Icon>
  );
}

/** Three overlapping circles: difference held together. */
export function InclusionIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="24" cy="26" r="13" pathLength={1} data-stroke style={d(0)} />
      <circle cx="40" cy="26" r="13" pathLength={1} data-stroke style={d(150)} />
      <circle cx="32" cy="40" r="13" pathLength={1} data-stroke style={d(300)} />
      <Accent cx={32} cy={31} r={3.5} ms={800} />
    </Icon>
  );
}

/** A voice on stage: spotlight onto a speaker. */
export function SpeakerIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M32 8 L16 50" pathLength={1} data-stroke style={d(0)} />
      <path d="M32 8 L48 50" pathLength={1} data-stroke style={d(0)} />
      <ellipse cx="32" cy="52" rx="16" ry="4" pathLength={1} data-stroke style={d(350)} />
      <path d="M32 44 V34" pathLength={1} data-stroke style={d(600)} />
      <Accent cx={32} cy={8} r={4} ms={300} />
      <Node cx={32} cy={30} r={4} ms={750} />
    </Icon>
  );
}

/** Two people in dialogue, the conversation lifting upward. */
export function CoachingIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 50 C 18 22, 46 22, 52 50" pathLength={1} data-stroke style={d(0)} />
      <path d="M32 28 V10" pathLength={1} data-stroke style={d(400)} />
      <path d="M26 16 L32 10 L38 16" pathLength={1} data-stroke style={d(600)} />
      <Node cx={12} cy={50} r={5} ms={300} />
      <Node cx={52} cy={50} r={5} ms={350} />
      <Accent cx={32} cy={29} r={3.5} ms={700} />
    </Icon>
  );
}

const ICONS: Record<IconName, (props: { className?: string }) => ReactNode> = {
  "one-stop": OneStopIcon,
  tailored: TailoredIcon,
  experts: ExpertsIcon,
  inclusion: InclusionIcon,
  speaker: SpeakerIcon,
  coaching: CoachingIcon,
};

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function isIconName(value: string): value is IconName {
  return value in ICONS;
}

export function LineIcon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={className} />;
}
