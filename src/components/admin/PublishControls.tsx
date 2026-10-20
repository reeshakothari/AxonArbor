"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { discardDrafts, publishSite } from "@/app/admin/actions";
import { AdminButton, ConfirmDialog, Toast } from "./ui";

/** Publish / discard buttons with the current draft status. */
export function PublishControls({ changedPages }: { changedPages: string[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<"publish" | "discard" | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "info" | "error" } | null>(null);
  const hasChanges = changedPages.length > 0;

  function flash(message: string, tone: "info" | "error" = "info") {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 4000);
  }

  async function run(action: typeof publishSite, success: string) {
    setBusy(true);
    const result = await action();
    setBusy(false);
    setDialog(null);
    if (result.ok) {
      flash(success);
      router.refresh();
    } else {
      flash(result.error, "error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm text-grey-600">
        <span aria-hidden="true" className={`size-2 rounded-full ${hasChanges ? "bg-amber" : "bg-grey-300"}`} />
        {hasChanges
          ? `Unpublished changes on ${changedPages.length} page${changedPages.length === 1 ? "" : "s"}`
          : "Everything is published"}
      </span>
      {hasChanges && (
        <>
          <AdminButton variant="ghost" size="sm" onClick={() => setDialog("discard")}>
            Discard
          </AdminButton>
          <AdminButton variant="primary" size="sm" onClick={() => setDialog("publish")}>
            Publish changes
          </AdminButton>
        </>
      )}

      <ConfirmDialog
        open={dialog === "publish"}
        title="Publish your changes?"
        confirmLabel="Publish now"
        busy={busy}
        onCancel={() => setDialog(null)}
        onConfirm={() => run(publishSite, "Published. Your changes are live.")}
      >
        These pages will update on the live website straight away: {changedPages.join(", ")}.
      </ConfirmDialog>
      <ConfirmDialog
        open={dialog === "discard"}
        title="Discard unpublished changes?"
        confirmLabel="Discard changes"
        busy={busy}
        onCancel={() => setDialog(null)}
        onConfirm={() => run(discardDrafts, "Changes discarded.")}
      >
        Your edits to {changedPages.join(", ")} will be thrown away and the editor will match the live website
        again. This can’t be undone.
      </ConfirmDialog>
      <Toast message={toast?.message ?? null} tone={toast?.tone} />
    </div>
  );
}
