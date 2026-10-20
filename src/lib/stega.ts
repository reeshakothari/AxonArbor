/**
 * Invisible source markers for the inline editor ("stega" encoding).
 *
 * In edit mode every display string gets a zero-width suffix that encodes an
 * id. The editor reads those ids back from the rendered DOM to know which
 * content field a piece of text came from, without any section component
 * having to know about editing. The public site never contains markers.
 */

const char = (code: number) => String.fromCharCode(code);

// Zero-width characters: never visible, never affect layout.
const START = char(0x2064); // invisible plus
const END = char(0x2063); // invisible separator
const DIGITS = [0x200b, 0x200c, 0x200d, 0x2060].map(char); // base-4 digits

const digitClass = `[${DIGITS.join("")}]`;
const MARKER_RE = new RegExp(`${START}(${digitClass}+)${END}`, "g");
const ANY_MARKER_CHAR_RE = new RegExp(`[${DIGITS.join("")}${START}${END}]`, "g");

export function encodeId(id: number): string {
  let digits = "";
  let n = id;
  do {
    digits = DIGITS[n % 4] + digits;
    n = Math.floor(n / 4);
  } while (n > 0);
  return START + digits + END;
}

function decodeDigits(digits: string): number {
  let n = 0;
  for (const ch of digits) n = n * 4 + DIGITS.indexOf(ch);
  return n;
}

/** Ids of all markers in a string, in order. */
export function decodeIds(text: string): number[] {
  return Array.from(text.matchAll(MARKER_RE), (m) => decodeDigits(m[1]));
}

export function stripMarkers(text: string): string {
  return text.replace(ANY_MARKER_CHAR_RE, "");
}

export function hasMarker(text: string): boolean {
  MARKER_RE.lastIndex = 0;
  return MARKER_RE.test(text);
}

/** Visible length of a string that may carry markers. */
export function visibleLength(text: string): number {
  return stripMarkers(text).length;
}

/**
 * Splits text into words while keeping it traceable in the inline editor:
 * the marker (if any) is copied onto every piece.
 */
export function splitWords(text: string): string[] {
  const markers = text.match(MARKER_RE)?.join("") ?? "";
  return stripMarkers(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word + markers);
}
