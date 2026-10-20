"use client";

/* eslint-disable @next/next/no-img-element -- admin thumbnails of arbitrary uploads */
import { blankOf, itemTemplate } from "@/lib/content/merge";
import type { IconName } from "@/content/types";
import { HIDDEN_KEYS, humanise, isLongText, sectionLabel } from "./labels";
import { getAt, isRecord, type Path } from "./paths";

const ICONS: IconName[] = ["one-stop", "tailored", "experts", "inclusion", "speaker", "coaching"];
const ICON_LABELS: Record<IconName, string> = {
  "one-stop": "Converging lines (one stop shop)",
  tailored: "Shaped paths (tailored)",
  experts: "Hub with people (experts)",
  inclusion: "Overlapping circles (inclusion)",
  speaker: "Spotlight (speaker)",
  coaching: "Dialogue (coaching)",
};

type Ctx = {
  root: unknown;
  onChange: (path: Path, value: unknown) => void;
  onEditImage: (path: Path) => void;
};

const inputClass =
  "mt-1.5 block w-full border border-grey-300 bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";

function isImage(value: unknown): value is { src: string; alt: string } {
  return isRecord(value) && typeof value.src === "string" && "alt" in value;
}

function itemTitle(item: unknown, index: number): string {
  if (typeof item === "string") return item || `Item ${index + 1}`;
  if (isRecord(item)) {
    for (const key of ["title", "name", "label", "heading", "text", "value"]) {
      if (typeof item[key] === "string" && item[key]) return item[key] as string;
    }
  }
  return `Item ${index + 1}`;
}

function ImageField({ path, value, ctx, label }: { path: Path; value: { src: string; alt: string }; ctx: Ctx; label: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-grey-700">{label}</p>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden border border-grey-200 bg-grey-100">
          {value.src ? (
            <img src={value.src} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[0.6rem] text-grey-500">No image</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => ctx.onEditImage(path)}
          className="border border-grey-300 px-3 py-2 text-xs hover:border-ink"
        >
          {value.src ? "Change image" : "Add image"}
        </button>
      </div>
    </div>
  );
}

function ListField({ path, items, ctx, label }: { path: Path; items: unknown[]; ctx: Ctx; label: string }) {
  const template = itemTemplate(items);
  const primitiveTemplate = items.length > 0 ? blankOf(items[0]) : "";
  const move = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    ctx.onChange(path, next);
  };
  const isPrimitive = items.every((i) => !isRecord(i));

  return (
    <fieldset className="border-l-2 border-grey-200 pl-4">
      <legend className="text-xs font-semibold tracking-wide text-grey-700 uppercase">{label}</legend>
      <ol className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className={isPrimitive ? "flex items-start gap-2" : "border border-grey-200 bg-paper"}>
            {isPrimitive ? (
              <>
                <div className="flex-1">
                  <Field path={[...path, i]} value={item} ctx={ctx} label={`${i + 1}`} compact />
                </div>
                <ItemControls i={i} count={items.length} move={move} remove={() => ctx.onChange(path, items.filter((_, j) => j !== i))} />
              </>
            ) : (
              <details>
                <summary className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm">
                  <span className="text-grey-400">{i + 1}.</span>
                  <span className="flex-1 truncate">{itemTitle(item, i)}</span>
                  <ItemControls i={i} count={items.length} move={move} remove={() => ctx.onChange(path, items.filter((_, j) => j !== i))} />
                </summary>
                <div className="space-y-4 border-t border-grey-100 p-3">
                  <ObjectFields path={[...path, i]} value={item as Record<string, unknown>} ctx={ctx} />
                </div>
              </details>
            )}
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => ctx.onChange(path, [...items, template ?? primitiveTemplate])}
        className="mt-2 text-xs font-semibold text-ink underline decoration-amber decoration-2 underline-offset-4"
      >
        + Add {isPrimitive ? "item" : "another"}
      </button>
    </fieldset>
  );
}

function ItemControls({ i, count, move, remove }: { i: number; count: number; move: (a: number, b: number) => void; remove: () => void }) {
  const btn = "px-1.5 py-1 text-xs text-grey-500 hover:text-ink disabled:opacity-30";
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };
  return (
    <span className="flex shrink-0 items-center">
      <button type="button" className={btn} disabled={i === 0} onClick={stop(() => move(i, i - 1))} aria-label="Move up">
        ↑
      </button>
      <button type="button" className={btn} disabled={i === count - 1} onClick={stop(() => move(i, i + 1))} aria-label="Move down">
        ↓
      </button>
      <button type="button" className={btn} onClick={stop(remove)} aria-label="Remove">
        ✕
      </button>
    </span>
  );
}

function ObjectFields({ path, value, ctx }: { path: Path; value: Record<string, unknown>; ctx: Ctx }) {
  return (
    <>
      {Object.entries(value)
        .filter(([key]) => !HIDDEN_KEYS.has(key))
        .map(([key, v]) => (
          <Field key={key} path={[...path, key]} value={v} ctx={ctx} label={humanise(key)} />
        ))}
    </>
  );
}

export function Field({
  path,
  value,
  ctx,
  label,
  compact = false,
}: {
  path: Path;
  value: unknown;
  ctx: Ctx;
  label: string;
  compact?: boolean;
}) {
  const key = path[path.length - 1];
  const id = `f-${path.join("-")}`;

  if (isImage(value)) return <ImageField path={path} value={value} ctx={ctx} label={label} />;

  if (key === "vendors" && Array.isArray(value) && value.every((v) => typeof v === "number")) {
    const names = (getAt(ctx.root, ["problem", "vendors"]) as string[] | undefined) ?? [];
    return (
      <fieldset>
        <legend className="text-xs font-medium text-grey-700">Vendors this pain point highlights</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {names.map((name, i) => {
            const on = value.includes(i);
            return (
              <label key={i} className={`cursor-pointer border px-2 py-1 text-xs ${on ? "border-ink bg-ink text-paper" : "border-grey-300"}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => ctx.onChange(path, on ? value.filter((v) => v !== i) : [...value, i].sort((a, b) => a - b))}
                />
                {name}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (Array.isArray(value)) return <ListField path={path} items={value} ctx={ctx} label={label} />;

  if (isRecord(value)) {
    return (
      <fieldset className="space-y-4 border-l-2 border-grey-200 pl-4">
        <legend className="text-xs font-semibold tracking-wide text-grey-700 uppercase">{label}</legend>
        <ObjectFields path={path} value={value} ctx={ctx} />
      </fieldset>
    );
  }

  if (key === "icon") {
    return (
      <label className="block text-xs font-medium text-grey-700">
        Drawing
        <select id={id} value={String(value ?? "")} onChange={(e) => ctx.onChange(path, e.target.value || undefined)} className={inputClass}>
          <option value="">None</option>
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {ICON_LABELS[icon]}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (key === "tone") {
    return (
      <label className="block text-xs font-medium text-grey-700">
        Style
        <select id={id} value={String(value ?? "")} onChange={(e) => ctx.onChange(path, e.target.value || undefined)} className={inputClass}>
          <option value="">Normal</option>
          <option value="heavy">Heavy (bold, sinks)</option>
          <option value="light">Light (italic, lifts)</option>
        </select>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="block text-xs font-medium text-grey-700">
        {label}
        <input id={id} type="number" value={value} onChange={(e) => ctx.onChange(path, Number(e.target.value))} className={inputClass} />
      </label>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value} onChange={(e) => ctx.onChange(path, e.target.checked)} />
        {label}
      </label>
    );
  }

  const text = String(value ?? "");
  const long = isLongText(key, text);
  return (
    <label className="block text-xs font-medium text-grey-700">
      {compact ? <span className="sr-only">{label}</span> : label}
      {key === "href" && !compact && (
        <span className="block font-normal text-grey-500">A page like /contact, or a full web address.</span>
      )}
      {long ? (
        <textarea
          id={id}
          value={text}
          rows={Math.min(8, Math.max(2, Math.ceil(text.length / 48)))}
          onChange={(e) => ctx.onChange(path, e.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input id={id} type="text" value={text} onChange={(e) => ctx.onChange(path, e.target.value)} className={inputClass} />
      )}
    </label>
  );
}

/** The full form for one content document. */
export function DocumentForm({ value, ctx }: { value: Record<string, unknown>; ctx: Ctx }) {
  return (
    <div className="space-y-3">
      {Object.entries(value)
        .filter(([key]) => !HIDDEN_KEYS.has(key))
        .map(([key, v]) =>
          isRecord(v) || Array.isArray(v) ? (
            <details key={key} className="border border-grey-200 bg-paper" open={key === "meta" ? false : undefined}>
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">{sectionLabel(key)}</summary>
              <div className="space-y-4 border-t border-grey-100 p-4">
                {Array.isArray(v) ? (
                  <Field path={[key]} value={v} ctx={ctx} label={humanise(key)} />
                ) : (
                  <ObjectFields path={[key]} value={v} ctx={ctx} />
                )}
              </div>
            </details>
          ) : (
            <div key={key} className="border border-grey-200 bg-paper p-4">
              <Field path={[key]} value={v} ctx={ctx} label={humanise(key)} />
            </div>
          ),
        )}
    </div>
  );
}
