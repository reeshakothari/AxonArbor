import type { ContentKey, ContentMap } from "@/content/registry";
import { encodeId } from "@/lib/stega";
import { NON_DISPLAY_KEYS } from "./labels";
import { isRecord, type FieldRef, type Path } from "./paths";

export type ImageRef = FieldRef & { src: string };

export type Encoded = {
  /** Content with an invisible id appended to every display string. */
  docs: ContentMap;
  /** id → which field the string came from. */
  fields: FieldRef[];
  images: ImageRef[];
};

/**
 * Prepares content for the inline editor: each piece of page text carries an
 * invisible marker, so a click on rendered text can be traced back to the
 * field it came from. Links, file paths and other technical values are left
 * untouched so the page keeps working.
 */
export function encodeDocs(docs: ContentMap): Encoded {
  const fields: FieldRef[] = [];
  const images: ImageRef[] = [];

  function walk(doc: ContentKey, value: unknown, path: Path): unknown {
    if (typeof value === "string") {
      const key = path[path.length - 1];
      if (typeof key === "string" && NON_DISPLAY_KEYS.has(key)) return value;
      if (path[0] === "meta") return value;
      fields.push({ doc, path });
      return value + encodeId(fields.length - 1);
    }
    if (Array.isArray(value)) return value.map((item, i) => walk(doc, item, [...path, i]));
    if (isRecord(value)) {
      if (typeof value.src === "string" && "alt" in value) images.push({ doc, path, src: value.src });
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(doc, v, [...path, k])]));
    }
    return value;
  }

  const encoded = Object.fromEntries(
    (Object.keys(docs) as ContentKey[]).map((key) => [key, walk(key, docs[key], [])]),
  ) as ContentMap;

  return { docs: encoded, fields, images };
}

/** The original image URL behind a rendered <img> (undoing next/image's proxy URL). */
export function sourceOfImg(img: HTMLImageElement): string {
  const raw = img.getAttribute("src") ?? "";
  if (raw.includes("/_next/image")) {
    const url = new URL(raw, window.location.origin).searchParams.get("url");
    if (url) return decodeURIComponent(url);
  }
  return raw;
}
