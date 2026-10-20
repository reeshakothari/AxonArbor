"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { restoreVersion } from "@/app/admin/actions";
import type { Version } from "@/lib/admin/data";
import { AdminButton, ConfirmDialog, formatDate, Toast } from "./ui";

export function HistoryList({ versions }: { versions: Version[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<Version | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function restore() {
    if (!target) return;
    setBusy(true);
    const result = await restoreVersion(target.id);
    setBusy(false);
    setTarget(null);
    if (result.ok) {
      router.push("/admin/edit/home");
      router.refresh();
    } else {
      setToast(result.error);
      setTimeout(() => setToast(null), 4000);
    }
  }

  if (versions.length === 0) {
    return (
      <p className="mt-8 border border-dashed border-grey-300 bg-paper p-8 text-center text-grey-600">
        Nothing has been published from the admin yet.
      </p>
    );
  }

  return (
    <>
      <ol className="mt-8 divide-y divide-grey-200 border border-grey-200 bg-paper">
        {versions.map((v, i) => (
          <li key={v.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium">
                {formatDate(v.published_at)}
                {i === 0 && <span className="eyebrow ml-3 bg-amber px-2 py-0.5 text-[0.6rem] text-ink">Live now</span>}
              </p>
              <p className="text-sm text-grey-600">Published by {v.published_by ?? "an admin"}</p>
            </div>
            {i > 0 && (
              <AdminButton size="sm" onClick={() => setTarget(v)}>
                Restore this version
              </AdminButton>
            )}
          </li>
        ))}
      </ol>
      <ConfirmDialog
        open={Boolean(target)}
        title="Restore this version?"
        confirmLabel="Restore to editor"
        busy={busy}
        onCancel={() => setTarget(null)}
        onConfirm={restore}
      >
        The website as it was on {target && formatDate(target.published_at)} will be loaded into the editor,
        replacing any unpublished changes. The live site won’t change until you publish.
      </ConfirmDialog>
      <Toast message={toast} tone="error" />
    </>
  );
}
