"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
};

const VARIANTS = {
  primary: "bg-amber text-ink hover:bg-ink hover:text-paper",
  dark: "bg-ink text-paper hover:bg-amber hover:text-ink",
  outline: "border border-grey-300 bg-paper text-ink hover:border-ink",
  ghost: "text-grey-700 hover:bg-grey-100 hover:text-ink",
  danger: "border border-grey-300 bg-paper text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

export function AdminButton({ variant = "outline", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 font-label font-semibold tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        size === "sm" ? "px-3 py-2 text-[0.65rem]" : "px-5 py-3 text-xs"
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

/** Modal confirmation built on <dialog> (focus trap and Escape for free). */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] border border-grey-200 bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/40"
    >
      <div className="p-7">
        <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
        {children && <div className="mt-3 text-grey-600">{children}</div>}
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <AdminButton variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </AdminButton>
          <AdminButton variant="dark" onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </dialog>
  );
}

export function Toast({ message, tone = "info" }: { message: string | null; tone?: "info" | "error" }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className={`fixed top-4 left-1/2 z-[100] -translate-x-1/2 px-5 py-3 text-sm shadow-lg ${
        tone === "error" ? "bg-ink text-paper" : "bg-amber text-ink"
      }`}
    >
      {message}
    </div>
  );
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
