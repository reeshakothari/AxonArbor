"use client";

/* eslint-disable @next/next/no-img-element -- previews of admin uploads */
import { useRef, useState } from "react";
import { Arbor } from "@/components/illustrations/Arbor";
import { isImageUrl } from "@/components/illustrations/Graphic";
import { ICON_NAMES, LineIcon } from "@/components/illustrations/Icons";
import type { IconName } from "@/content/types";
import { ACCEPT_ATTR } from "../media";
import { AdminButton } from "../ui";

const ICON_LABELS: Record<IconName, string> = {
  "one-stop": "Converging lines",
  tailored: "Shaped paths",
  experts: "Hub with people",
  inclusion: "Overlapping circles",
  speaker: "Spotlight",
  coaching: "Dialogue",
};

type Props = {
  /** Where to anchor the picker; null opens it in the middle of the screen. */
  rect: DOMRect | null;
  /** "icon" (small line icons) or "illustration" (the hero drawing). */
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  onLibrary: () => void;
  onClose: () => void;
};

/** Choose a built-in drawing, upload your own image, or remove the drawing. */
export function GraphicPicker({ rect, fieldKey, value, onChange, onUpload, onLibrary, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const isIllustration = fieldKey === "illustration";
  const width = 400;

  const style = rect
    ? {
        left: Math.min(Math.max(12, rect.left), window.innerWidth - width - 12),
        top: rect.bottom + 380 < window.innerHeight - 80 ? rect.bottom + 10 : Math.max(12, rect.top - 390),
        width,
      }
    : { left: "50%", top: "50%", width, transform: "translate(-50%, -50%)" };

  const option = (key: string, label: string, preview: React.ReactNode) => (
    <button
      key={key}
      type="button"
      onClick={() => onChange(key)}
      aria-pressed={value === key}
      className={`flex flex-col items-center gap-1.5 border p-2 text-[11px] leading-tight ${
        value === key ? "border-ink bg-grey-100" : "border-grey-200 hover:border-ink"
      }`}
    >
      <span className="flex size-14 items-center justify-center text-ink">{preview}</span>
      {label}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-label="Change drawing"
      className="fixed z-[70] border border-grey-200 bg-paper p-4 font-sans text-ink shadow-2xl"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs text-grey-500">{isIllustration ? "Drawing beside the heading" : "Icon"}</p>
        <button type="button" onClick={onClose} className="text-xs text-grey-500 hover:text-ink">
          Done
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {isIllustration
          ? option("arbor", "Tree drawing", <Arbor className="h-14 w-auto" />)
          : ICON_NAMES.map((name) => option(name, ICON_LABELS[name], <LineIcon name={name} className="size-12" />))}
        {isImageUrl(value) &&
          option(value, "Your image", <img src={value} alt="" className="max-h-14 max-w-14 object-contain" />)}
        {option("", "None", <span className="text-grey-400">—</span>)}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-grey-100 pt-4">
        <AdminButton variant="dark" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Uploading…" : "Upload your own"}
        </AdminButton>
        <AdminButton size="sm" onClick={onLibrary}>
          Choose from library
        </AdminButton>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            await onUpload(file);
            setUploading(false);
          }}
        />
      </div>
    </div>
  );
}
