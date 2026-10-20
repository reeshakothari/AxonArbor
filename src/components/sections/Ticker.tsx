type TickerProps = {
  label: string;
  items: string[];
};

/**
 * Slow, endless band of facilitator areas. CSS-only; pauses on hover and
 * becomes a static wrapped list for visitors who prefer reduced motion.
 */
export function Ticker({ label, items }: TickerProps) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="ticker-row flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="font-serif-italic text-2xl italic sm:text-3xl">{item}</span>
          <span aria-hidden="true" className="mx-6 size-1.5 rounded-full bg-amber sm:mx-8" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="ticker overflow-hidden border-y border-grey-200 py-7">
      <div className="ticker-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
