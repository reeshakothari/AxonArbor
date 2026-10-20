"use client";

/* eslint-disable @next/next/no-img-element -- admin thumbnails of arbitrary uploads */
import { useCallback, useEffect, useRef, useState } from "react";
import { ACCEPT_ATTR, BUILT_IN_IMAGES, deleteUpload, listUploads, uploadImage, type MediaItem } from "./media";
import { AdminButton, ConfirmDialog } from "./ui";

type Props = {
  /** When set, the library is a picker: clicking an image chooses it. */
  onPick?: (item: MediaItem) => void;
};

export function MediaLibrary({ onPick }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<MediaItem | null>(null);
  const [dragging, setDragging] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setUploads(await listUploads());
    } catch (e) {
      setError((e as Error).message);
      setUploads([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    listUploads()
      .then((items) => !cancelled && setUploads(items))
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        setUploads([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      let last: MediaItem | null = null;
      for (const file of Array.from(files)) last = await uploadImage(file);
      await refresh();
      if (onPick && last && files.length === 1) onPick(last);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const tile = (item: MediaItem) => (
    <li key={item.src} className="group relative">
      <button
        type="button"
        onClick={() => onPick?.(item)}
        disabled={!onPick}
        className={`block aspect-square w-full overflow-hidden border border-grey-200 bg-grey-100 ${
          onPick ? "cursor-pointer hover:border-ink focus-visible:border-ink" : "cursor-default"
        }`}
        title={item.name}
      >
        <img src={item.src} alt="" loading="lazy" className="h-full w-full object-contain" />
      </button>
      <p className="mt-1 truncate text-xs text-grey-600">{item.name}</p>
      {!item.builtIn && !onPick && (
        <div className="absolute top-2 right-2 hidden gap-1 group-hover:flex group-focus-within:flex">
          <AdminButton size="sm" onClick={() => navigator.clipboard.writeText(item.src)}>
            Copy link
          </AdminButton>
          <AdminButton size="sm" variant="danger" onClick={() => setToDelete(item)}>
            Delete
          </AdminButton>
        </div>
      )}
    </li>
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? "border-amber bg-amber/10" : "border-grey-300 bg-paper"
        }`}
      >
        <p className="text-grey-700">Drag images here, or</p>
        <AdminButton variant="dark" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? "Uploading…" : "Upload from your computer"}
        </AdminButton>
        <p className="text-xs text-grey-500">PNG, JPG, WebP, GIF, AVIF or SVG, up to 10 MB.</p>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple={!onPick}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-ink">
          {error}
        </p>
      )}

      <h3 className="eyebrow mt-8 text-grey-500">Your uploads</h3>
      {uploads === null ? (
        <p className="mt-3 text-sm text-grey-500">Loading…</p>
      ) : uploads.length === 0 ? (
        <p className="mt-3 text-sm text-grey-500">Nothing uploaded yet.</p>
      ) : (
        <ul className="mt-3 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">{uploads.map(tile)}</ul>
      )}

      <h3 className="eyebrow mt-8 text-grey-500">Images already on the site</h3>
      <ul className="mt-3 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">{BUILT_IN_IMAGES.map(tile)}</ul>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this image?"
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          const item = toDelete!;
          setToDelete(null);
          try {
            await deleteUpload(item.src);
            await refresh();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        If this image is used on the website, it will stop showing there. Replace it on those pages first.
      </ConfirmDialog>
    </div>
  );
}
