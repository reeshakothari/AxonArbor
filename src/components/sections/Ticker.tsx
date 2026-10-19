type TickerProps = {
  label: string;
  items: string[];
};

/**
 * Slow, endless band of facilitator areas. CSS-only; pauses on hover and
 * becomes a static wrapped list for visitors who prefer reduced motion.
 */
export function Ticker({ label, items }: TickerProps) {
  const row = (hidden: boolean, alt = false) => (
    <ul aria-hidden={hidden || undefined} className="ticker-row flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          {alt ? (
            <span className="font-label text-sm font-semibold tracking-[0.2em] text-grey-500 uppercase sm:text-base">
              {item}
            </span>
          ) : (
            <span className="font-serif-italic text-4xl italic sm:text-6xl">{item}</span>
          )}
          <span
            aria-hidden="true"
            className={`rounded-full bg-amber ${alt ? "mx-6 size-1.5" : "mx-8 size-3 sm:mx-12"}`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="ticker overflow-hidden border-y border-grey-200 py-10">
      <div className="ticker-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden="true" className="ticker-track-reverse mt-5 flex w-max">
        {row(true, true)}
        {row(true, true)}
      </div>
    </section>
  );
}
