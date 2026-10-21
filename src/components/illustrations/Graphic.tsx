"use client";

/* eslint-disable @next/next/no-img-element -- admin-uploaded artwork of unknown size */
import { useIsEditing } from "@/components/editing-context";
import { hasMarker, stripMarkers } from "@/lib/stega";
import { Arbor } from "./Arbor";
import { Draw } from "./Draw";
import { isIconName, LineIcon } from "./Icons";

type Props = {
  /** A built-in drawing name ("one-stop", "arbor"…), an image URL, or empty. */
  value: string | undefined;
  kind: "icon" | "illustration";
  /** Layout classes for the wrapper. */
  className?: string;
  /** Size classes shared by drawings and uploaded images. */
  sizeClassName: string;
  drawThreshold?: number;
};

export const isImageUrl = (value: string) => /^(https?:)?\/\//.test(value) || value.startsWith("/");

/**
 * An editable drawing slot. Renders a built-in line drawing, an image the
 * admin uploaded, or nothing. In the inline editor it carries the field's
 * marker (data-edit) so a click can open the drawing picker, and shows an
 * "Add" placeholder when empty.
 */
export function Graphic({ value = "", kind, className = "", sizeClassName, drawThreshold }: Props) {
  const editing = useIsEditing();
  const clean = stripMarkers(value).trim();

  let content: React.ReactNode = null;
  if (kind === "icon" && isIconName(clean)) {
    content = (
      <Draw threshold={drawThreshold}>
        <LineIcon name={clean} className={sizeClassName} />
      </Draw>
    );
  } else if (kind === "illustration" && clean === "arbor") {
    content = (
      <Draw threshold={drawThreshold}>
        <Arbor className={sizeClassName} />
      </Draw>
    );
  } else if (clean && isImageUrl(clean)) {
    content = <img src={clean} alt="" aria-hidden="true" className={`${sizeClassName} object-contain`} />;
  } else if (editing) {
    content = (
      <span
        className={`${sizeClassName} flex items-center justify-center border border-dashed border-grey-400 text-center font-sans text-[11px] leading-tight text-grey-500`}
      >
        + Add {kind === "icon" ? "icon" : "drawing"}
      </span>
    );
  }

  if (!content) return null;
  return (
    <div data-edit={hasMarker(value) ? value : undefined} className={`text-ink ${className}`}>
      {content}
    </div>
  );
}
