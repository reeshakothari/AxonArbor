/**
 * "Operationally heavy, strategically light" as a see-saw. As the pull-quote
 * scrolls into view, operations boxes drop onto the left of the beam and it
 * tips under their weight while a single amber strategy node rises on the
 * right. Scroll-driven CSS (see `.balance-*` in globals.css).
 */
export function Balance({ heavyLabel, lightLabel, className = "" }: { heavyLabel: string; lightLabel: string; className?: string }) {
  const boxes = [
    { x: 58, y: 196, w: 64, h: 40 },
    { x: 126, y: 196, w: 52, h: 40 },
    { x: 70, y: 152, w: 56, h: 40 },
    { x: 130, y: 152, w: 40, h: 40 },
    { x: 92, y: 108, w: 52, h: 40 },
  ];

  return (
    <svg viewBox="0 0 520 330" fill="none" aria-hidden="true" className={`overflow-visible ${className}`}>
      {/* Fulcrum and ground */}
      <path d="M260 244 L226 300 H294 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M150 300 H370" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      <g className="balance-beam">
        <path d="M30 240 H490" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="260" cy="240" r="6" className="fill-amber" />

        {boxes.map((b, i) => (
          <g key={i} className="balance-box" style={{ animationRange: `cover ${12 + i * 5}% cover ${22 + i * 5}%` }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} stroke="currentColor" strokeWidth="2" className="fill-ink" />
            <path d={`M${b.x + 8} ${b.y + b.h / 2} H${b.x + b.w - 8}`} stroke="currentColor" strokeWidth="1" opacity="0.4" />
          </g>
        ))}

        <g className="balance-light">
          <circle cx="430" cy="222" r="16" className="fill-amber breathe" />
          <circle cx="430" cy="222" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" className="spin-slow" style={{ transformOrigin: "430px 222px" }} />
        </g>
      </g>

      <text x="118" y="326" textAnchor="middle" className="fill-current font-label text-[13px] font-semibold tracking-[0.2em] uppercase">
        {heavyLabel}
      </text>
      <text x="430" y="326" textAnchor="middle" className="fill-current font-label text-[13px] font-semibold tracking-[0.2em] uppercase">
        {lightLabel}
      </text>
    </svg>
  );
}
