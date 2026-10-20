import type { ContentKey } from "@/content/registry";

export type Path = (string | number)[];
export type FieldRef = { doc: ContentKey; path: Path };

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function getAt(root: unknown, path: Path): unknown {
  let cur: unknown = root;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

/** Immutable set: returns a copy of root with the value at path replaced. */
export function setAt<T>(root: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy as T;
  }
  const obj = (isRecord(root) ? root : {}) as Record<string, unknown>;
  return { ...obj, [head]: setAt(obj[head as string], rest, value) } as T;
}

/** The closest list containing this path, with the index of the item in it. */
export function nearestList(root: unknown, path: Path): { listPath: Path; index: number } | null {
  for (let i = path.length - 1; i >= 0; i--) {
    if (typeof path[i] === "number" && Array.isArray(getAt(root, path.slice(0, i)))) {
      return { listPath: path.slice(0, i), index: path[i] as number };
    }
  }
  return null;
}

export function sameRef(a: FieldRef | null, b: FieldRef | null) {
  return Boolean(a && b && a.doc === b.doc && a.path.join(".") === b.path.join("."));
}
